import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useEditor, EditorContent, useEditorState } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import { Placeholder } from '@tiptap/extensions';
import { Field, Msg, Spinner, SectionHead, ConfirmButton } from '../ui.jsx';
import { StateBadge } from './Overview.jsx';
import { api, clearCache } from '../../lib/api.js';
import { shrinkImage } from '../../lib/shrink.js';
import { COVER_STYLES, isoLocal, fromLocal } from '../../lib/format.js';

const CATS = ['Exam Tips', 'Study Plans', 'Parents', 'Updates'];
const EMPTY = { title: '', slug: '', category: 'Exam Tips', excerpt: '', content: '', cover: null, coverStyle: 'physics', author: 'HAwk ACademe', status: 'draft', publishAt: new Date().toISOString() };

async function uploadImage(file) {
  const form = new FormData();
  form.append('file', await shrinkImage(file));
  return api('/admin/uploads', { method: 'POST', form });
}

function Toolbar({ editor, onError }) {
  const fileRef = useRef(null);
  const st = useEditorState({
    editor,
    selector: ({ editor: e }) => ({
      bold: e.isActive('bold'), italic: e.isActive('italic'), underline: e.isActive('underline'),
      h2: e.isActive('heading', { level: 2 }), h3: e.isActive('heading', { level: 3 }),
      ul: e.isActive('bulletList'), ol: e.isActive('orderedList'), quote: e.isActive('blockquote'), link: e.isActive('link'),
      undo: e.can().undo(), redo: e.can().redo()
    })
  });
  const b = (on, label, title, run, disabled) => (
    <button type="button" className={on ? 'on' : undefined} aria-pressed={on} title={title} aria-label={title} disabled={disabled} onMouseDown={(e) => e.preventDefault()} onClick={run}>{label}</button>
  );
  const chain = () => editor.chain().focus();
  function setLink() {
    const prev = editor.getAttributes('link').href || '';
    const url = window.prompt('Link address (https://… or a page like /programs). Leave empty to remove the link.', prev);
    if (url === null) return;
    if (!url.trim()) return chain().extendMarkRange('link').unsetLink().run();
    const href = /^(https?:\/\/|mailto:|tel:|\/)/.test(url.trim()) ? url.trim() : `https://${url.trim()}`;
    chain().extendMarkRange('link').setLink({ href }).run();
  }
  async function addImage(e) {
    const f = e.target.files?.[0];
    e.target.value = '';
    if (!f) return;
    try {
      const img = await uploadImage(f);
      const alt = window.prompt('Describe the picture in a few words (for people using screen readers):', '') || '';
      chain().setImage({ src: img.url, alt }).run();
    } catch (ex) { onError(ex.message); }
  }
  return (
    <div className="ed-bar" role="toolbar" aria-label="Formatting">
      {b(st.h2, 'H2', 'Heading', () => chain().toggleHeading({ level: 2 }).run())}
      {b(st.h3, 'H3', 'Sub-heading', () => chain().toggleHeading({ level: 3 }).run())}
      <span className="sep" />
      {b(st.bold, <b>B</b>, 'Bold', () => chain().toggleBold().run())}
      {b(st.italic, <i>I</i>, 'Italic', () => chain().toggleItalic().run())}
      {b(st.underline, <u>U</u>, 'Underline', () => chain().toggleUnderline().run())}
      {b(st.link, 'Link', 'Add or remove a link', setLink)}
      <span className="sep" />
      {b(st.ul, '• List', 'Bulleted list', () => chain().toggleBulletList().run())}
      {b(st.ol, '1. List', 'Numbered list', () => chain().toggleOrderedList().run())}
      {b(st.quote, '“ Quote', 'Quote', () => chain().toggleBlockquote().run())}
      {b(false, '— Line', 'Divider line', () => chain().setHorizontalRule().run())}
      {b(false, 'Picture', 'Add a picture', () => fileRef.current?.click())}
      <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={addImage} />
      <span className="sep" />
      {b(false, 'Undo', 'Undo', () => chain().undo().run(), !st.undo)}
      {b(false, 'Redo', 'Redo', () => chain().redo().run(), !st.redo)}
    </div>
  );
}

// Loads the post, then opens the editor with its content.
export default function PostEditor() {
  const { id } = useParams();
  const isNew = id === 'new';
  const [loaded, setLoaded] = useState(isNew ? { post: EMPTY } : null);
  const [loadErr, setLoadErr] = useState('');
  useEffect(() => {
    if (isNew) { setLoaded({ post: EMPTY }); return undefined; }
    let live = true;
    setLoaded(null);
    api(`/admin/posts/${id}`).then((r) => live && setLoaded({ post: r.post })).catch((e) => live && setLoadErr(e.message));
    return () => { live = false; };
  }, [id, isNew]);
  if (loadErr) return <div className="a-err" role="alert">{loadErr} <a href="/admin/blog">Back to the blog list</a></div>;
  if (!loaded) return <Spinner />;
  return <PostForm key={loaded.post.id || 'new'} initial={loaded.post} isNew={!loaded.post.id} />;
}

function PostForm({ initial, isNew }) {
  const navigate = useNavigate();
  const [post, setPost] = useState(initial);
  const id = post.id;
  const location = useLocation();
  const [ok, setOk] = useState(location.state?.msg || '');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [coverBusy, setCoverBusy] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] }, link: { openOnClick: false, autolink: true, defaultProtocol: 'https' }, codeBlock: false }),
      Image,
      Placeholder.configure({ placeholder: 'Write the article here. Use H2 for section headings.' })
    ],
    content: initial.content || '',
    onUpdate: () => setDirty(true)
  });

  // Warn before closing the tab with unsaved changes.
  useEffect(() => {
    if (!dirty) return undefined;
    const warn = (e) => { e.preventDefault(); e.returnValue = ''; };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  const set = (k) => (e) => { setPost((p) => ({ ...p, [k]: e.target.value })); setDirty(true); };

  async function onCover(e) {
    const f = e.target.files?.[0];
    e.target.value = '';
    if (!f) return;
    setCoverBusy(true);
    setErr('');
    try {
      const img = await uploadImage(f);
      setPost((p) => ({ ...p, cover: { url: img.url, key: img.key, width: img.width, height: img.height, alt: p.cover?.alt || p.title } }));
      setDirty(true);
    } catch (ex) { setErr(ex.message); } finally { setCoverBusy(false); }
  }

  async function save(status) {
    setErr('');
    setOk('');
    if (post.title.trim().length < 3) return setErr('Please enter a title (at least 3 characters).');
    const content = editor.isEmpty ? '' : editor.getHTML();
    if (status === 'published' && !content) return setErr('Please write the article before publishing.');
    setBusy(true);
    try {
      const body = { ...post, status, content, cover: post.cover?.url ? post.cover : null };
      const r = isNew
        ? await api('/admin/posts', { method: 'POST', body })
        : await api(`/admin/posts/${id}`, { method: 'PUT', body });
      clearCache();
      setPost(r.post);
      setDirty(false);
      const when = r.post.state === 'scheduled' ? ` It will appear on ${new Date(r.post.publishAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}.` : '';
      const msg = status === 'draft' ? 'Saved as a draft (not visible on the website).' : r.post.state === 'scheduled' ? `Saved and scheduled.${when}` : 'Published. It is live on the blog now.';
      setOk(msg);
      if (isNew) navigate(`/admin/blog/${r.post.id}`, { replace: true, state: { msg } });
    } catch (ex) { setErr(ex.message); } finally { setBusy(false); }
  }

  async function remove() {
    await api(`/admin/posts/${id}`, { method: 'DELETE' });
    clearCache();
    setDirty(false);
    navigate('/admin/blog');
  }

  if (!editor) return <Spinner />;
  const scheduledFuture = new Date(post.publishAt) > new Date();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <SectionHead title={isNew ? 'New blog post' : 'Edit blog post'}>
        {!isNew && <StateBadge state={post.state} />}
        <a className="a-ghost" href="/admin/blog" onClick={(e) => { if (dirty && !window.confirm('Leave without saving your changes?')) e.preventDefault(); }}>Back to posts</a>
      </SectionHead>
      <Msg ok={ok} err={err} />
      <div className="a-card">
        <div className="a-grid">
          <Field label="Title" full>{(p) => <input {...p} className="a-in" type="text" maxLength={160} value={post.title} onChange={set('title')} autoFocus={isNew} />}</Field>
          <Field label="Category">{(p) => (
            <select {...p} className="a-in" value={post.category} onChange={set('category')}>{CATS.map((c) => <option key={c}>{c}</option>)}</select>
          )}</Field>
          <Field label="Author">{(p) => <input {...p} className="a-in" type="text" maxLength={80} value={post.author} onChange={set('author')} />}</Field>
          <Field label="Summary (shown on the blog list and in Google)" full hint={`${post.excerpt.length}/300. Leave empty to use the start of the article.`}>
            {(p) => <textarea {...p} className="a-in" rows={2} maxLength={300} value={post.excerpt} onChange={set('excerpt')} />}
          </Field>
        </div>
      </div>

      <div className="a-card">
        <h3 style={{ fontSize: 18 }}>Cover</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, alignItems: 'flex-start' }}>
          <div style={{ width: 280, maxWidth: '100%' }}>
            {post.cover?.url ? (
              <img src={post.cover.url} alt="" style={{ display: 'block', width: '100%', height: 160, objectFit: 'cover', borderRadius: 10 }} />
            ) : (
              <div aria-hidden="true" style={{ height: 110, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: 'Georgia, serif', fontStyle: 'italic', fontWeight: 700, fontSize: 28, background: COVER_STYLES[post.coverStyle]?.bg }}>{COVER_STYLES[post.coverStyle]?.glyph}</div>
            )}
          </div>
          <div style={{ flex: '1 1 260px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              <label className="a-ghost sm" style={{ cursor: coverBusy ? 'wait' : 'pointer' }}>
                {coverBusy ? 'Uploading…' : post.cover?.url ? 'Change photo' : 'Upload a cover photo'}
                <input type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={onCover} disabled={coverBusy} />
              </label>
              {post.cover?.url && <button type="button" className="a-ghost sm" onClick={() => { setPost((p) => ({ ...p, cover: null })); setDirty(true); }}>Remove photo</button>}
            </div>
            {post.cover?.url ? (
              <Field label="Describe the photo (alt text)">{(p) => <input {...p} className="a-in" type="text" maxLength={200} value={post.cover.alt || ''} onChange={(e) => { setPost((x) => ({ ...x, cover: { ...x.cover, alt: e.target.value } })); setDirty(true); }} />}</Field>
            ) : (
              <Field label="Without a photo, use this style" hint="A coloured band from the design, used when there is no photo.">{(p) => (
                <select {...p} className="a-in" value={post.coverStyle} onChange={set('coverStyle')}>
                  {Object.entries(COVER_STYLES).map(([k, v]) => <option key={k} value={k}>{v.label} ({v.glyph})</option>)}
                </select>
              )}</Field>
            )}
          </div>
        </div>
      </div>

      <div className="a-card">
        <h3 style={{ fontSize: 18 }} id="ed-label">Article</h3>
        <div className="ed" aria-labelledby="ed-label">
          <Toolbar editor={editor} onError={setErr} />
          <div className="ed-body prose"><EditorContent editor={editor} /></div>
        </div>
      </div>

      <div className="a-card">
        <h3 style={{ fontSize: 18 }}>Publishing</h3>
        <div className="a-grid">
          <Field label="Publish date and time" hint={scheduledFuture ? 'This date is in the future, so the post will appear on the website automatically at that time.' : 'Shown on the post. Pick a future time to schedule it.'}>
            {(p) => <input {...p} className="a-in" type="datetime-local" value={isoLocal(post.publishAt)} onChange={(e) => { if (e.target.value) { setPost((x) => ({ ...x, publishAt: fromLocal(e.target.value) })); setDirty(true); } }} />}
          </Field>
          <Field label="Web address" hint={`hawkacademe.com/blog/${post.slug || '(made from the title)'}`}>
            {(p) => <input {...p} className="a-in" type="text" maxLength={80} placeholder="made from the title" value={post.slug} onChange={(e) => { setPost((x) => ({ ...x, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })); setDirty(true); }} />}
          </Field>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
          <button type="button" className="a-btn" disabled={busy} onClick={() => save('published')}>{busy ? 'Saving…' : scheduledFuture ? 'Schedule' : post.status === 'published' ? 'Update' : 'Publish'}</button>
          <button type="button" className="a-ghost" disabled={busy} onClick={() => save('draft')}>{post.status === 'published' && !isNew ? 'Unpublish (save as draft)' : 'Save draft'}</button>
          {!isNew && post.state === 'published' && <a className="a-ghost" href={`/blog/${post.slug}`} target="_blank" rel="noopener">View on website</a>}
          {dirty && <span style={{ fontSize: 13, color: '#7A5300', fontWeight: 600 }}>Unsaved changes</span>}
          {!isNew && <span style={{ marginLeft: 'auto' }}><ConfirmButton className="a-ghost" label="Delete post" confirmLabel="Yes, delete" onConfirm={remove} /></span>}
        </div>
      </div>
    </div>
  );
}
