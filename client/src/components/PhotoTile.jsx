// A photo that shows an "Enlarge" overlay on hover or keyboard focus and opens the Lightbox on click.
export default function PhotoTile({ photo, height = 190, lazy = true, onOpen }) {
  return (
    <button type="button" className="card zoom-tile" onClick={onOpen} aria-label="Enlarge photo"
      style={{ padding: 0, border: 0, borderRadius: 12, overflow: 'hidden', cursor: 'zoom-in', background: '#ffffff', boxShadow: '0 8px 22px rgba(11,29,69,.08)' }}>
      <img src={photo.thumbUrl} alt={photo.alt} loading={lazy ? 'lazy' : undefined} decoding="async" style={{ display: 'block', width: '100%', height, objectFit: 'cover' }} />
      <span className="zoom-ico" aria-hidden="true">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4M11 8v6M8 11h6" /></svg>
        Enlarge
      </span>
    </button>
  );
}
