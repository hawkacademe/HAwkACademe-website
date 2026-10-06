// One-off helper: converts a design concept page (design concept/project/*.dc.html)
// into a JSX starting point. The output is meant to be edited by hand afterwards.
//   node tools/convert-design.mjs Main > /tmp/Main.jsx
import { readFileSync } from 'node:fs';
import { parseDocument } from 'htmlparser2';

const name = process.argv[2];
const src = readFileSync(new URL(`../../design concept/project/${name}.dc.html`, import.meta.url), 'utf8');
const doc = parseDocument(src, { lowerCaseAttributeNames: false, lowerCaseTags: false, decodeEntities: true, recognizeSelfClosing: true });

const ROUTES = {
  Main: '/', About: '/about', Programs: '/programs', Results: '/results', Gallery: '/gallery',
  Blog: '/blog', BlogPost: '/blog', News: '/news', Contact: '/contact', AdminLogin: '/admin/login',
  Admin: '/admin', NotFound: '/404'
};
const VOID = new Set(['img', 'br', 'hr', 'input', 'meta', 'link', 'source', 'area', 'col', 'wbr']);
const INLINE = new Set(['a', 'span', 'strong', 'b', 'em', 'i', 'img', 'small', 'code', 'label', 'button', 'svg', 'sup', 'sub', 'u', 'mark']);
const ATTR = {
  class: 'className', for: 'htmlFor', tabindex: 'tabIndex', readonly: 'readOnly', maxlength: 'maxLength',
  minlength: 'minLength', autocomplete: 'autoComplete', colspan: 'colSpan', rowspan: 'rowSpan', srcset: 'srcSet',
  crossorigin: 'crossOrigin', novalidate: 'noValidate', inputmode: 'inputMode', enterkeyhint: 'enterKeyHint',
  autofocus: 'autoFocus', 'xlink:href': 'xlinkHref', 'xml:space': 'xmlSpace', allowfullscreen: 'allowFullScreen',
  referrerpolicy: 'referrerPolicy', frameborder: 'frameBorder', datetime: 'dateTime', spellcheck: 'spellCheck',
  onInput: 'onChange'
};

const isExpr = (s) => /^\{\{[\s\S]*\}\}$/.test(s.trim()) && s.trim().indexOf('{{', 2) === -1;
const inner = (s) => s.trim().slice(2, -2).trim();
const tmpl = (s) => '`' + s.replace(/`/g, '\\`').replace(/\{\{([\s\S]*?)\}\}/g, (_, e) => '${' + e.trim() + '}') + '`';
const camel = (k) => k.replace(/-([a-z])/g, (_, c) => c.toUpperCase());

function styleObj(s) {
  const out = [];
  for (const decl of s.split(/;(?![^(]*\))/)) {
    const i = decl.indexOf(':');
    if (i < 0) continue;
    let k = decl.slice(0, i).trim();
    const v = decl.slice(i + 1).trim();
    if (!k) continue;
    k = k.startsWith('--') ? `'${k}'` : camel(k.replace(/^-webkit-/, 'Webkit-').replace(/^-ms-/, 'ms-'));
    out.push(`${/^[\w$]+$/.test(k) ? k : k}: ${JSON.stringify(v)}`);
  }
  return '{{ ' + out.join(', ') + ' }}';
}

function attrs(el) {
  const out = [];
  for (const [k0, v] of Object.entries(el.attribs)) {
    if (k0.startsWith('hint-')) continue;
    const k = ATTR[k0] || (k0.startsWith('aria-') || k0.startsWith('data-') ? k0 : camel(k0));
    if (k === 'style') {
      if (v.includes('{{')) out.push(`style={css(${isExpr(v) ? inner(v) : tmpl(v)})}`);
      else out.push(`style=${styleObj(v)}`);
      continue;
    }
    if (v === '' && !['alt', 'value', 'placeholder'].includes(k)) { out.push(k); continue; }
    if (v.includes('{{')) { out.push(`${k}={${isExpr(v) ? inner(v) : tmpl(v)}}`); continue; }
    let val = v;
    if (k === 'href') {
      const m = /^([A-Za-z]+)\.dc\.html(#.*)?$/.exec(v);
      if (m) val = (ROUTES[m[1]] ? ROUTES[m[1]] : `#NOPRO:${m[1]}`) + (m[2] || '');
    }
    if (k === 'src' && v.startsWith('../img/')) val = '/img/' + v.slice(7);
    const key = el.name === 'input' || el.name === 'textarea' || el.name === 'select'
      ? ({ value: 'defaultValue', checked: 'defaultChecked' }[k] || k) : k;
    out.push(`${key}=${JSON.stringify(val)}`);
  }
  return out.length ? ' ' + out.join(' ') : '';
}

function text(t) {
  let s = t.replace(/\s+/g, ' ');
  if (!s.trim()) return null;
  const parts = [];
  let last = 0;
  s.replace(/\{\{([\s\S]*?)\}\}/g, (m, e, i) => { parts.push(['t', s.slice(last, i)]); parts.push(['e', e.trim()]); last = i + m.length; });
  parts.push(['t', s.slice(last)]);
  return parts.map(([k, v]) => {
    if (k === 'e') return `{${v}}`;
    if (!v) return '';
    if (/^\s|\s$|[{}<>]/.test(v)) return `{${JSON.stringify(v)}}`;
    return v;
  }).join('');
}

function kids(nodes, depth) {
  const out = [];
  nodes.forEach((n, i) => {
    if (n.type === 'text') {
      const t = text(n.data);
      if (t !== null) out.push(t);
      else if (/\S/.test(n.data) === false) {
        const a = nodes[i - 1], b = nodes[i + 1];
        if (a && b && a.type === 'tag' && b.type === 'tag' && INLINE.has(a.name) && INLINE.has(b.name) && !n.data.includes('\n')) out.push('{" "}');
      }
    } else if (n.type === 'comment') {
      const c = n.data.trim();
      if (c) out.push(`{/* ${c.replace(/\*\//g, '* /')} */}`);
    } else if (n.type === 'tag' || n.type === 'script' || n.type === 'style') {
      out.push(el(n, depth));
    }
  });
  return out;
}

function el(n, depth) {
  const pad = '  '.repeat(depth);
  if (n.name === 'helmet' || n.name === 'script') return '';
  if (n.name === 'sc-if') {
    const c = kids(n.children, depth + 1).filter(Boolean);
    return `{(${inner(n.attribs.value)}) && (<>\n${pad}  ${c.join('\n' + pad + '  ')}\n${pad}</>)}`;
  }
  if (n.name === 'sc-for') {
    const as = n.attribs.as;
    const c = kids(n.children, depth + 1).filter(Boolean);
    return `{(${inner(n.attribs.list)}).map((${as}, ${as}Index) => (<Fragment key={${as}Index}>\n${pad}  ${c.join('\n' + pad + '  ')}\n${pad}</Fragment>))}`;
  }
  const a = attrs(n);
  if (VOID.has(n.name)) return `<${n.name}${a} />`;
  if (n.name === 'textarea') {
    const t = n.children.map((c) => c.data || '').join('');
    return `<textarea${a}${t.trim() ? ` defaultValue=${JSON.stringify(t)}` : ''} />`;
  }
  const c = kids(n.children, depth + 1).filter(Boolean);
  if (!c.length) return `<${n.name}${a}></${n.name}>`;
  const oneLine = c.join('');
  if (oneLine.length < 160 && !oneLine.includes('\n')) return `<${n.name}${a}>${oneLine}</${n.name}>`;
  return `<${n.name}${a}>\n${pad}  ${c.join('\n' + pad + '  ')}\n${pad}</${n.name}>`;
}

const find = (nodes, tag) => {
  for (const n of nodes) {
    if (n.type === 'tag' && n.name === tag) return n;
    if (n.children) { const r = find(n.children, tag); if (r) return r; }
  }
  return null;
};
const root = find(doc.children, 'x-dc');
const helmet = find(root.children, 'helmet');
const css = helmet ? helmet.children.filter((c) => c.type === 'style' || c.name === 'style').map((s) => s.children.map((t) => t.data).join('')).join('\n') : '';
const script = (src.match(/<script type="text\/x-dc"[^>]*>([\s\S]*?)<\/script>/) || [])[1] || '';

process.stdout.write(`/* ===== PAGE CSS =====\n${css}\n===== */\n\n/* ===== LOGIC =====\n${script.replace(/\*\//g, '* /')}\n===== */\n\n`);
process.stdout.write(kids(root.children, 0).filter(Boolean).join('\n') + '\n');
