import { useMemo, useState } from "react";
import stores from "../data/stores.json";
import { useI18n } from "../i18n";

export default function Stores() {
  const { t } = useI18n();
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
        <p className="eyebrow">{t("stores.kicker")}</p>
        <h1>{t("stores.title")}</h1>
        <p>{t("stores.lead", { total, cities: stores.length })}</p>
      </div>
      <label className="search search-wide">
        <span className="sr">{t("stores.search")}</span>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t("stores.ph")}
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
                      <em>{t("stores.route")}</em>
                    </a>
                  </li>
                ))}
              </ul>
            </article>
          );
        })}
      </div>
      {filtered.length === 0 ? <p className="empty">{t("stores.empty")}</p> : null}
    </section>
  );
}
