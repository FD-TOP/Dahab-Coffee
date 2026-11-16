import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  allItems,
  categories,
  findItem,
  formatPrice,
  groups,
} from "../data/menu";

const PICKS_KEY = "dahab-picks";

function loadPicks() {
  try {
    const raw = JSON.parse(localStorage.getItem(PICKS_KEY) || "[]");
    return Array.isArray(raw) ? raw.filter((row) => row?.id && row.qty > 0) : [];
  } catch {
    return [];
  }
}

function AnimatedPrice({ value }) {
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

  return <strong className="price-pop">{formatPrice(current)}</strong>;
}

export default function MenuPage() {
  const [params, setParams] = useSearchParams();
  const [group, setGroup] = useState("all");
  const [categoryId, setCategoryId] = useState("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("menu");
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
        entry.note.toLowerCase().includes(needle) ||
        entry.category.label.toLowerCase().includes(needle);
      return inGroup && inCategory && inSearch;
    });
    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "name") list = [...list].sort((a, b) => a.name.localeCompare(b.name, "fr"));
    return list;
  }, [group, categoryId, query, sort]);

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

  return (
    <section className="menu-page">
      <div className="menu-hero">
        <div>
          <p className="script menu-script">Menu</p>
          <h1>La carte, vivante</h1>
          <p>
            Cherchez, filtrez, ouvrez une fiche et composez votre sélection.
            Les prix viennent de la carte Dahab.
          </p>
        </div>
        <button className="tray-launch" onClick={() => setTray(true)}>
          Ma sélection
          <b>{pickCount}</b>
        </button>
      </div>

      <div className="menu-tools">
        <label className="search">
          <span className="sr">Rechercher</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Espresso, miel, frappé, amlou…"
          />
        </label>
        <div className="chips" role="tablist" aria-label="Familles">
          {groups.map((entry) => (
            <button
              key={entry.id}
              role="tab"
              aria-selected={group === entry.id}
              className={group === entry.id ? "is-on" : ""}
              onClick={() => chooseGroup(entry.id)}
            >
              {entry.label}
            </button>
          ))}
        </div>
        <label className="sort">
          Trier
          <select value={sort} onChange={(event) => setSort(event.target.value)}>
            <option value="menu">Ordre de la carte</option>
            <option value="price-asc">Prix croissant</option>
            <option value="price-desc">Prix décroissant</option>
            <option value="name">Nom</option>
          </select>
        </label>
      </div>

      <div className="menu-layout">
        <aside className="cat-rail">
          <button
            className={categoryId === "all" ? "is-on" : ""}
            onClick={() => setCategoryId("all")}
          >
            <i />
            Tout voir
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
              {category.label}
              {category.badge ? <small>{category.badge}</small> : null}
              <em>{category.items.length}</em>
            </button>
          ))}
        </aside>

        <div className="menu-board">
          <div className="board-head">
            <div>
              <h2>{activeCategory ? activeCategory.label : "Toute la carte"}</h2>
              <p>
                {activeCategory
                  ? activeCategory.blurb
                  : "Toutes les familles correspondant à votre filtre."}
              </p>
            </div>
            <span>{items.length} référence{items.length > 1 ? "s" : ""}</span>
          </div>

          {selected ? (
            <article className="spotlight" key={selected.id}>
              <button className="close" onClick={() => setSelectedId("")} aria-label="Fermer la fiche">
                ×
              </button>
              <p className="eyebrow" style={{ color: selected.category.accent }}>
                {selected.category.label}
              </p>
              <h3>{selected.name}</h3>
              {selected.note ? <p className="note">{selected.note}</p> : <p className="note">Carte Dahab Coffee</p>}
              <AnimatedPrice value={selected.price} />
              <div className="spot-actions">
                <button className="btn btn-dark" onClick={() => addPick(selected.id)}>
                  Ajouter à ma sélection
                </button>
                <button
                  className="btn btn-ghost"
                  onClick={() => {
                    setGroup(selected.category.group);
                    setCategoryId(selected.category.id);
                  }}
                >
                  Voir la famille
                </button>
              </div>
            </article>
          ) : null}

          {items.length === 0 ? (
            <p className="empty">Aucun produit pour cette recherche. Essayez un autre mot.</p>
          ) : (
            <ul className="item-grid" key={`${group}-${categoryId}-${query}-${sort}`}>
              {items.map((entry, index) => (
                <li key={entry.id} style={{ "--i": Math.min(index, 18) }}>
                  <button
                    className={`item-card ${selectedId === entry.id ? "is-active" : ""}`}
                    onClick={() => openItem(entry.id)}
                    style={{ "--accent": entry.category.accent }}
                  >
                    <span className="item-cat">{entry.category.label}</span>
                    <span className="item-name">{entry.name}</span>
                    {entry.note ? <span className="item-note">{entry.note}</span> : null}
                    <span className="item-price">{formatPrice(entry.price)}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div
        className={`tray ${tray ? "is-open" : ""}`}
        role="dialog"
        aria-label="Ma sélection"
        aria-hidden={!tray}
        inert={tray ? undefined : true}
      >
        <div className="tray-panel">
          <header>
            <h2>Ma sélection</h2>
            <button onClick={() => setTray(false)} aria-label="Fermer">
              ×
            </button>
          </header>
          {picks.length === 0 ? (
            <p className="empty">Votre liste est vide. Ouvrez une boisson et ajoutez-la.</p>
          ) : (
            <ul>
              {picks.map((row) => {
                const entry = findItem(row.id);
                if (!entry) return null;
                return (
                  <li key={row.id}>
                    <div>
                      <strong>{entry.name}</strong>
                      <span>{formatPrice(entry.price)}</span>
                    </div>
                    <div className="qty">
                      <button onClick={() => changeQty(row.id, -1)} aria-label="Retirer un">
                        −
                      </button>
                      <b>{row.qty}</b>
                      <button onClick={() => changeQty(row.id, 1)} aria-label="Ajouter un">
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
              <span>Total estimé</span>
              <strong>{formatPrice(pickTotal)}</strong>
            </div>
            <button className="btn btn-ghost" onClick={() => setPicks([])} disabled={!picks.length}>
              Vider
            </button>
          </footer>
          <p className="tray-hint">Liste de dégustation, à montrer au comptoir. Pas une commande en ligne.</p>
        </div>
      </div>
    </section>
  );
}
