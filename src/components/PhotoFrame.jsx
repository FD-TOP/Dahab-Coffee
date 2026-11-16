export default function PhotoFrame({ src, alt = "", fit = "cover" }) {
  return (
    <span className="photo-frame">
      <img key={src} src={src} alt={alt} style={{ objectFit: fit }} />
      <span className="photo-shine" aria-hidden="true" />
    </span>
  );
}
