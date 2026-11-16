import { useMemo, useRef, useState } from "react";
import MoroccoMap from "../components/MoroccoMap";
import { placeName } from "../data/morocco";
import stores from "../data/stores.json";
import { useI18n } from "../i18n";

export default function Stores() {
  const { t, lang } = useI18n();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState("");
  const [listCity, setListCity] = useState("");
  const [copied, setCopied] = useState("");
  const copyTimer = useRef(0);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return stores;
    return stores
      .map((city) => ({
        ...city,
        stores: city.stores.filter(
          (store) =>
            city.city.toLowerCase().includes(needle) ||
            placeName(city.city, lang).toLowerCase().includes(needle) ||
            store.name.toLowerCase().includes(needle)
        ),
      }))
      .filter((city) => city.stores.length);
  }, [query, lang]);

  const visible = useMemo(() => new Set(filtered.map((city) => city.city)), [filtered]);
  const total = stores.reduce((sum, city) => sum + city.stores.length, 0);
  const current = filtered.find((city) => city.city === active) || null;

  function showCity(city, scroll) {
    setActive(city);
    if (!scroll) return;
    window.requestAnimationFrame(() => {
      document.querySelector(".city-card")?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  }

  function copyAddress(store, city) {
    const line = `${store.name}, ${placeName(city, lang)}`;
    const key = `${city}:${store.name}`;
    setCopied(key);
    window.clearTimeout(copyTimer.current);
    copyTimer.current = window.setTimeout(() => setCopied(""), 1600);
    const fallback = () => {
      const field = document.createElement("textarea");
      field.value = line;
      field.setAttribute("readonly", "");
      document.body.appendChild(field);
      field.select();
      document.execCommand("copy");
      field.remove();
    };
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(line).catch(fallback);
    } else {
      fallback();
    }
  }

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

      <div className="locator">
        <MoroccoMap
          visible={visible}
          active={active}
          lang={lang}
          label={t("stores.map")}
          onSelect={showCity}
        />
        <aside className="city-card" aria-live="polite">
          {current ? (
            <>
              <header>
                <h2>{placeName(current.city, lang)}</h2>
                <span>{t("stores.count", { n: current.stores.length })}</span>
              </header>
              <ul>
                {current.stores.map((store) => {
                  const key = `${current.city}:${store.name}`;
                  return (
                    <li key={store.name}>
                      <div>
                        <strong>{store.name}</strong>
                        <span>{placeName(current.city, lang)}</span>
                      </div>
                      <div className="addr-actions">
                        <button type="button" onClick={() => copyAddress(store, current.city)}>
                          {copied === key ? t("stores.copied") : t("stores.copy")}
                        </button>
                        <a href={store.map} target="_blank" rel="noreferrer">
                          {t("stores.route")}
                        </a>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </>
          ) : (
            <p className="city-hint">{t("stores.hint")}</p>
          )}
        </aside>
      </div>

      <h2 className="list-title">{t("stores.all")}</h2>
      <div className="city-grid">
        {filtered.map((city) => {
          const opened = listCity === city.city || query.trim().length > 0;
          return (
            <article key={city.city} className={opened ? "is-open" : ""}>
              <button
                type="button"
                onClick={() => {
                  const next = opened && !query ? "" : city.city;
                  setListCity(next);
                  if (next) setActive(next);
                }}
              >
                <span>{placeName(city.city, lang)}</span>
                <b>{city.stores.length}</b>
              </button>
              <ul>
                {city.stores.map((store) => {
                  const key = `${city.city}:${store.name}`;
                  return (
                    <li key={store.name}>
                      <a href={store.map} target="_blank" rel="noreferrer">
                        {store.name}
                        <em>{t("stores.route")}</em>
                      </a>
                      <button type="button" onClick={() => copyAddress(store, city.city)}>
                        {copied === key ? t("stores.copied") : t("stores.copy")}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </article>
          );
        })}
      </div>
      {filtered.length === 0 ? <p className="empty">{t("stores.empty")}</p> : null}
    </section>
  );
}
