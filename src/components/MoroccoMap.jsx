import { MAP_H, MAP_W, moroccoPath, placeName, places } from "../data/morocco";

export default function MoroccoMap({ visible, active, lang, label, onSelect }) {
  return (
    <div className="morocco" role="group" aria-label={label}>
      <svg viewBox={`0 0 ${MAP_W} ${MAP_H}`} aria-hidden="true">
        <rect className="sea" width={MAP_W} height={MAP_H} rx="28" />
        <path className="land" d={moroccoPath} />
        <text className="map-word" x="470" y="46">
          {lang === "ar" ? "المغرب" : "Maroc"}
        </text>
      </svg>
      {places.map((place) => {
        const shown = visible.has(place.city);
        const name = placeName(place.city, lang);
        return (
          <button
            key={place.city}
            type="button"
            className={`map-pin side-${place.side} ${active === place.city ? "is-on" : ""} ${shown ? "" : "is-dim"}`}
            style={{ left: `${(place.x / MAP_W) * 100}%`, top: `${(place.y / MAP_H) * 100}%` }}
            aria-pressed={active === place.city}
            aria-label={name}
            onMouseEnter={() => shown && onSelect(place.city, false)}
            onFocus={() => shown && onSelect(place.city, false)}
            onClick={() => shown && onSelect(place.city, true)}
          >
            <i />
            <span>{name}</span>
          </button>
        );
      })}
    </div>
  );
}
