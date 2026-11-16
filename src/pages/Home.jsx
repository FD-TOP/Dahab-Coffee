import { Link } from "react-router-dom";
import { categories, featuredIds, findItem, formatPrice, itemCount } from "../data/menu";
import { flavorOf } from "../data/flavors";
import stores from "../data/stores.json";

const bags = [
  {
    src: "/arabica.png",
    name: "Arabica Royal",
    text: "100 % arabica, tasse équilibrée, du grain au cappuccino.",
  },
  {
    src: "/moka.png",
    name: "Moka Prestige",
    text: "Le café du quotidien Dahab, rond, servi chaud ou glacé.",
  },
  {
    src: "/special.png",
    name: "Spécial",
    text: "L'assemblage de la maison, en tasse et en paquet.",
  },
];

export default function Home() {
  const featured = featuredIds.map(findItem).filter(Boolean);
  const storeCount = stores.reduce((sum, city) => sum + city.stores.length, 0);

  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Dahab Café · Maroc</p>
          <h1>
            L'univers
            <span> de Dahab</span>
          </h1>
          <p className="lead">
            Une expérience où la qualité artisanale et la diversité des produits
            ouvrent un voyage gustatif. Cent cafés, une histoire écrite avec vous.
          </p>
          <div className="hero-actions">
            <Link className="btn btn-dark" to="/menu">
              Ouvrir le menu
            </Link>
            <Link className="btn btn-ghost" to="/stores">
              Trouver un store
            </Link>
          </div>
          <ul className="hero-stats">
            <li>
              <strong>{storeCount}</strong>
              <span>adresses au Maroc</span>
            </li>
            <li>
              <strong>{itemCount}</strong>
              <span>références au menu</span>
            </li>
            <li>
              <strong>{categories.length}</strong>
              <span>familles de produits</span>
            </li>
          </ul>
        </div>
        <div className="hero-stage" aria-hidden="true">
          <div className="ring" />
          <div className="cup">
            <span className="steam s1" />
            <span className="steam s2" />
            <span className="steam s3" />
            <div className="cup-body">
              <img src="/logo.png" alt="" />
              <small>Tout un plaisir</small>
            </div>
            <div className="cup-foot" />
          </div>
          <p className="hero-mark">
            100
            <span>merci</span>
          </p>
        </div>
      </section>

      <div className="marquee" aria-hidden="true">
        <div>
          {categories.concat(categories).map((category, index) => (
            <span key={`${category.id}-${index}`}>{category.label}</span>
          ))}
        </div>
      </div>

      <section className="section">
        <div className="section-head">
          <p className="eyebrow">Grains</p>
          <h2>250 g — 1 kg</h2>
          <p>Les cafés de la maison, à boire sur place ou à emporter en paquet.</p>
        </div>
        <div className="bag-grid">
          {bags.map((bag, index) => (
            <article className="bag-card" key={bag.name} style={{ "--i": index }}>
              <img src={bag.src} alt={bag.name} />
              <h3>{bag.name}</h3>
              <p>{bag.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section section-tight">
        <div className="section-head">
          <p className="eyebrow">Signatures</p>
          <h2>À commander du bout du doigt</h2>
          <p>Le menu n'est plus un PDF : chaque boisson s'ouvre, se compare et se note.</p>
        </div>
        <div className="feature-row">
          {featured.map((entry) => (
            <Link key={entry.id} to={`/menu?item=${entry.id}`} className="feature-card">
              <img src={flavorOf(entry).image} alt="" />
              <strong>{entry.name}</strong>
              <em>{formatPrice(entry.price)}</em>
            </Link>
          ))}
        </div>
      </section>

      <section className="band">
        <div>
          <p className="eyebrow light">Réseau</p>
          <h2>Explorez nos points de vente</h2>
          <p>
            De Tanger à Marrakech, {stores.length} villes et {storeCount} adresses,
            avec l'itinéraire de chaque boutique.
          </p>
          <Link className="btn btn-light" to="/stores">
            Voir les stores
          </Link>
        </div>
        <ul>
          {stores.map((city) => (
            <li key={city.city}>
              <b>{city.stores.length}</b>
              {city.city}
            </li>
          ))}
        </ul>
      </section>

      <section className="section split">
        <div>
          <p className="eyebrow">Franchise</p>
          <h2>Écrire la suite avec Dahab</h2>
          <p>
            La marque, le savoir-faire et l'accompagnement pour ouvrir un Dahab Coffee.
            Dix années de métier, et l'envie de les transmettre.
          </p>
          <Link className="btn btn-dark" to="/franchise">
            Devenir franchisé
          </Link>
        </div>
        <blockquote>
          « Notre souhait est de fournir à nos franchisés les outils nécessaires
          pour une gestion efficace et une réussite absolue. »
          <cite>Direction Dahab</cite>
        </blockquote>
      </section>
    </>
  );
}
