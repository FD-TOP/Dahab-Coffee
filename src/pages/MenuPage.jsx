import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  allItems,
  categories,
  findItem,
  formatPrice,
  groups,
} from "../data/menu";
import { flavorChoices, flavorOf } from "../data/flavors";
import { useI18n } from "../i18n";
import PhotoFrame from "../components/PhotoFrame";

const PICKS_KEY = "dahab-picks";

function loadPicks() {
  try {
    const raw = JSON.parse(localStorage.getItem(PICKS_KEY) || "[]");
    return Array.isArray(raw) ? raw.filter((row) => row?.id && row.qty > 0) : [];
  } catch {
    return [];
  }
}

function AnimatedPrice({ value, suffix }) {
  const [shown, setShown] = useState(0);

  useEffect(() => {
    let frame = 0;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min(1, (now - start) / 520);
      const eased = 1 - (1 - progress) ** 3;
      setShown(value * eased);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value]);

  const current = Number.isInteger(value)
    ? Math.round(shown)
    : Math.round(shown * 10) / 10;

  const amount = formatPrice(current).replace(" DH", "");
  return <strong className="price-pop">{`${amount} ${suffix}`}</strong>;
}

export default function MenuPage() {
  const { t, text, lang, categoryLabel, categoryBlurb } = useI18n();
  const [params, setParams] = useSearchParams();
  const [group, setGroup] = useState("all");
  const [categoryId, setCategoryId] = useState("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("menu");
  const [flavorId, setFlavorId] = useState("");
  const [selectedId, setSelectedId] = useState(params.get("item") || "");
  const [picks, setPicks] = useState(loadPicks);
  const [tray, setTray] = useState(false);

  useEffect(() => {
    localStorage.setItem(PICKS_KEY, JSON.stringify(picks));
  }, [picks]);

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === "Escape") setSelectedId("");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const node = document.querySelector(".spotlight, .flavor-stage");
    if (!node) return;
    node.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [selectedId, flavorId]);

  const visibleCategories = categories.filter(
    (category) => group === "all" || category.group === group
  );

  const items = useMemo(() => {
    const needle = query.trim().toLowerCase();
    let list = allItems().filter((entry) => {
      const inGroup = group === "all" || entry.category.group === group;
      const inCategory = categoryId === "all" || entry.category.id === categoryId;
      const inSearch =
        !needle ||
        entry.name.toLowerCase().includes(needle) ||
        text(entry.name).toLowerCase().includes(needle) ||
        entry.note.toLowerCase().includes(needle) ||
        text(entry.note).toLowerCase().includes(needle) ||
        categoryLabel(entry.category.id).toLowerCase().includes(needle) ||
        t(`flavor.${flavorOf(entry).id}`).toLowerCase().includes(needle);
      const inFlavor = !flavorId || flavorOf(entry).id === flavorId;
      return inGroup && inCategory && inSearch && inFlavor;
    });
    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "name") list = [...list].sort((a, b) => a.name.localeCompare(b.name, "fr"));
    return list;
  }, [group, categoryId, query, sort, flavorId, lang, text, categoryLabel, t]);

  const selected = selectedId ? findItem(selectedId) : null;
  const pickCount = picks.reduce((sum, row) => sum + row.qty, 0);
  const pickTotal = picks.reduce((sum, row) => {
    const entry = findItem(row.id);
    return sum + (entry ? entry.price * row.qty : 0);
  }, 0);

  function chooseGroup(next) {
    setGroup(next);
    setCategoryId("all");
  }

  function money(value) {
    const amount = formatPrice(value).replace(" DH", "");
    return lang === "ar" ? `${amount} د.م` : `${amount} DH`;
  }

  function openItem(id) {
    setSelectedId(id);
    const next = new URLSearchParams(params);
    next.set("item", id);
    setParams(next, { replace: true });
  }

  function addPick(id) {
    setPicks((current) => {
      const found = current.find((row) => row.id === id);
      if (found) {
        return current.map((row) => (row.id === id ? { ...row, qty: row.qty + 1 } : row));
      }
      return [...current, { id, qty: 1 }];
    });
    setTray(true);
  }

  function changeQty(id, delta) {
    setPicks((current) =>
      current
        .map((row) => (row.id === id ? { ...row, qty: row.qty + delta } : row))
        .filter((row) => row.qty > 0)
    );
  }

  const activeCategory = categories.find((category) => category.id === categoryId);
  const activeFlavor = flavorChoices.find((flavor) => flavor.id === flavorId) || null;

  return (
    <section className="menu-page">
      <div className="menu-hero">
        <div>
          <p className="script menu-script">{t("menu.script")}</p>
          <h1>{t("menu.title")}</h1>
          <p>{t("menu.lead")}</p>
          <ol className="howto">
            <li>{t("menu.step1")}</li>
            <li>{t("menu.step2")}</li>
            <li>{t("menu.step3")}</li>
          </ol>
        </div>
        <button className="tray-launch" onClick={() => setTray(true)}>
          {t("menu.picks")}
          <b>{pickCount}</b>
        </button>
      </div>

      <div className="menu-tools">
        <label className="search">
          <span className="sr">{t("menu.search")}</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t("menu.searchPh")}
          />
        </label>
        <div className="chips" role="tablist" aria-label={t("menu.families")}>
          {groups.map((entry) => (
            <button
              key={entry.id}
              role="tab"
              aria-selected={group === entry.id}
              className={group === entry.id ? "is-on" : ""}
              onClick={() => chooseGroup(entry.id)}
            >
              {t(`group.${entry.id}`)}
            </button>
          ))}
        </div>
        <label className="sort">
          {t("menu.sort")}
          <select value={sort} onChange={(event) => setSort(event.target.value)}>
            <option value="menu">{t("menu.sortMenu")}</option>
            <option value="price-asc">{t("menu.sortAsc")}</option>
            <option value="price-desc">{t("menu.sortDesc")}</option>
            <option value="name">{t("menu.sortName")}</option>
          </select>
        </label>
      </div>

      <div className="flavor-row" role="listbox" aria-label={t("menu.flavors")}>
        {flavorChoices.map((flavor) => (
          <button
            key={flavor.id}
            role="option"
            aria-selected={flavorId === flavor.id}
            className={flavorId === flavor.id ? "is-on" : ""}
            onClick={() => setFlavorId((current) => (current === flavor.id ? "" : flavor.id))}
          >
            <PhotoFrame src={flavor.image} />
            {t(`flavor.${flavor.id}`)}
          </button>
        ))}
      </div>

      <div className="menu-layout">
        <aside className="cat-rail">
          <button
            className={categoryId === "all" ? "is-on" : ""}
            onClick={() => setCategoryId("all")}
          >
            <i />
            {t("menu.all")}
            <em>{visibleCategories.reduce((sum, category) => sum + category.items.length, 0)}</em>
          </button>
          {visibleCategories.map((category) => (
            <button
              key={category.id}
              className={categoryId === category.id ? "is-on" : ""}
              onClick={() => setCategoryId(category.id)}
              style={{ "--accent": category.accent }}
            >
              <i />
              {categoryLabel(category.id)}
              {category.badge ? <small>{t("badge.new")}</small> : null}
              <em>{category.items.length}</em>
            </button>
          ))}
        </aside>

        <div className="menu-board">
          <div className="board-head">
            <div>
              <h2>
                {activeFlavor
                  ? t(`flavor.${activeFlavor.id}`)
                  : activeCategory
                    ? categoryLabel(activeCategory.id)
                    : t("menu.allTitle")}
              </h2>
              <p>
                {activeFlavor
                  ? t("menu.flavorText")
                  : activeCategory
                    ? categoryBlurb(activeCategory.id)
                    : t("menu.allText")}
              </p>
            </div>
            <span>{t("menu.count", { n: items.length })}</span>
          </div>

          {activeFlavor && !selected ? (
            <article className="flavor-stage" key={activeFlavor.id}>
              <PhotoFrame src={activeFlavor.image} alt={t(`flavor.${activeFlavor.id}`)} />
              <div>
                <p className="eyebrow">{t("menu.flavor")}</p>
                <h3>{t(`flavor.${activeFlavor.id}`)}</h3>
                <p>{t("menu.withFlavor", { n: items.length })}</p>
              </div>
            </article>
          ) : null}

          {selected ? (
            <article className="spotlight" key={selected.id}>
              <button className="close" onClick={() => setSelectedId("")} aria-label={t("menu.close")}>
                ×
              </button>
              <PhotoFrame
                src={flavorOf(selected).image}
                alt={t(`flavor.${flavorOf(selected).id}`)}
                fit={flavorOf(selected).fit || "cover"}
              />
              <div className="spot-copy">
                <p className="eyebrow" style={{ color: selected.category.accent }}>
                  {categoryLabel(selected.category.id)} · {t(`flavor.${flavorOf(selected).id}`)}
                </p>
                <h3>{text(selected.name)}</h3>
                {selected.note ? <p className="note">{text(selected.note)}</p> : <p className="note">{t("menu.noteFallback")}</p>}
                <AnimatedPrice value={selected.price} suffix={lang === "ar" ? "د.م" : "DH"} />
                <div className="spot-actions">
                  <button className="btn btn-dark" onClick={() => addPick(selected.id)}>
                    {t("menu.add")}
                  </button>
                  <button
                    className="btn btn-ghost"
                    onClick={() => {
                      setGroup(selected.category.group);
                      setCategoryId(selected.category.id);
                      setFlavorId("");
                    }}
                  >
                    {t("menu.family")}
                  </button>
                </div>
              </div>
            </article>
          ) : null}

          {items.length === 0 ? (
            <p className="empty">{t("menu.empty")}</p>
          ) : (
            <ul className="item-grid" key={`${group}-${categoryId}-${query}-${sort}-${flavorId}`}>
              {items.map((entry, index) => {
                const flavor = flavorOf(entry);
                return (
                  <li key={entry.id} style={{ "--i": Math.min(index, 18) }}>
                    <button
                      className={`item-card ${selectedId === entry.id ? "is-active" : ""}`}
                      onClick={() => openItem(entry.id)}
                      style={{ "--accent": entry.category.accent }}
                    >
                      <PhotoFrame src={flavor.image} fit={flavor.fit || "cover"} />
                      <span className="item-cat">{t(`flavor.${flavor.id}`)}</span>
                      <span className="item-name">{text(entry.name)}</span>
                      {entry.note ? <span className="item-note">{text(entry.note)}</span> : null}
                      <span className="item-price">{money(entry.price)}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      <div
        className={`tray ${tray ? "is-open" : ""}`}
        role="dialog"
        aria-label={t("menu.tray")}
        aria-hidden={!tray}
        inert={tray ? undefined : true}
      >
        <div className="tray-panel">
          <header>
            <h2>{t("menu.tray")}</h2>
            <button onClick={() => setTray(false)} aria-label={t("menu.close")}>
              ×
            </button>
          </header>
          {picks.length === 0 ? (
            <p className="empty">{t("menu.trayEmpty")}</p>
          ) : (
            <ul>
              {picks.map((row) => {
                const entry = findItem(row.id);
                if (!entry) return null;
                return (
                  <li key={row.id}>
                    <div className="tray-item">
                      <PhotoFrame src={flavorOf(entry).image} fit={flavorOf(entry).fit || "cover"} />
                      <div>
                        <strong>{text(entry.name)}</strong>
                        <span>{money(entry.price)}</span>
                      </div>
                    </div>
                    <div className="qty">
                      <button onClick={() => changeQty(row.id, -1)} aria-label={t("menu.remove")}>
                        −
                      </button>
                      <b>{row.qty}</b>
                      <button onClick={() => changeQty(row.id, 1)} aria-label={t("menu.plus")}>
                        +
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
          <footer>
            <div>
              <span>{t("menu.total")}</span>
              <strong>{money(pickTotal)}</strong>
            </div>
            <button className="btn btn-ghost" onClick={() => setPicks([])} disabled={!picks.length}>
              {t("menu.clear")}
            </button>
          </footer>
          <p className="tray-hint">{t("menu.hint")}</p>
        </div>
      </div>
    </section>
  );
}
