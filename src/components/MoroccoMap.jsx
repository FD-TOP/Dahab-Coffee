import { pinLabel, placeName, places } from "../data/morocco";

export default function MoroccoMap({ visible, active, lang, label, onSelect }) {
  return (
    <div className="morocco" role="group" aria-label={label}>
      <img src="/morocco-dune.jpg" alt={lang === "ar" ? "المغرب" : "Maroc"} />
      {places.map((place) => {
        const shown = visible.has(place.city);
        const name = placeName(place.city, lang);
        const label = pinLabel(place.city, lang);
        return (
          <button
            key={place.city}
            type="button"
            className={`map-pin side-${place.side} ${active === place.city ? "is-on" : ""} ${shown ? "" : "is-dim"}`}
            style={{ left: `${place.x}%`, top: `${place.y}%` }}
            aria-pressed={active === place.city}
            aria-label={name}
            onMouseEnter={() => shown && onSelect(place.city, false)}
            onFocus={() => shown && onSelect(place.city, false)}
            onClick={() => shown && onSelect(place.city, true)}
          >
            <i />
            <span>{label}</span>
          </button>
        );
      })}
    </div>
  );
}
