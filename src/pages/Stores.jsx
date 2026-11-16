import { useMemo, useState } from "react";
import stores from "../data/stores.json";

export default function Stores() {
  const [query, setQuery] = useState("");
  const [openCity, setOpenCity] = useState(stores[0]?.city || "");

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return stores;
    return stores
      .map((city) => ({
        ...city,
        stores: city.stores.filter(
          (store) =>
            city.city.toLowerCase().includes(needle) ||
            store.name.toLowerCase().includes(needle)
        ),
      }))
      .filter((city) => city.stores.length);
  }, [query]);

  const total = stores.reduce((sum, city) => sum + city.stores.length, 0);

  return (
    <section className="page">
      <div className="page-intro">
        <p className="eyebrow">Nos stores</p>
        <h1>Points de vente</h1>
        <p>
          {total} adresses dans {stores.length} villes. Choisissez une ville, puis ouvrez
          l'itinéraire de la boutique.
        </p>
      </div>
      <label className="search search-wide">
        <span className="sr">Rechercher une ville ou une boutique</span>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Tanger, Koutoubia, Oulfa…"
        />
      </label>
      <div className="city-grid">
        {filtered.map((city) => {
          const opened = openCity === city.city || query.trim().length > 0;
          return (
            <article key={city.city} className={opened ? "is-open" : ""}>
              <button onClick={() => setOpenCity(opened && !query ? "" : city.city)}>
                <span>{city.city}</span>
                <b>{city.stores.length}</b>
              </button>
              <ul>
                {city.stores.map((store) => (
                  <li key={store.name}>
                    <a href={store.map} target="_blank" rel="noreferrer">
                      {store.name}
                      <em>Itinéraire</em>
                    </a>
                  </li>
                ))}
              </ul>
            </article>
          );
        })}
      </div>
      {filtered.length === 0 ? <p className="empty">Aucune boutique ne correspond.</p> : null}
    </section>
  );
}
