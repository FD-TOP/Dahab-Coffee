import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { categories, featuredIds, findItem, formatPrice, itemCount } from "../data/menu";
import { flavorOf } from "../data/flavors";
import { useI18n } from "../i18n";
import PhotoFrame from "../components/PhotoFrame";
import stores from "../data/stores.json";

const bags = [
  {
    src: "/arabica.png",
    name: "Arabica Royal",
    text: "home.bag1",
  },
  {
    src: "/moka.png",
    name: "Moka Prestige",
    text: "home.bag2",
  },
  {
    src: "/special.png",
    name: "Spécial",
    text: "home.bag3",
  },
];

export default function Home() {
  const { t, text, categoryLabel, lang } = useI18n();
  const featured = featuredIds.map(findItem).filter(Boolean);
  const storeCount = stores.reduce((sum, city) => sum + city.stores.length, 0);
  const [shot, setShot] = useState(0);

  useEffect(() => {
    if (!featured.length) return undefined;
    const timer = setInterval(() => setShot((index) => (index + 1) % featured.length), 3400);
    return () => clearInterval(timer);
  }, [featured.length]);

  const current = featured[shot];

  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">{t("home.kicker")}</p>
          <h1>
            {t("home.title")}
            <span> {t("home.titleEm")}</span>
          </h1>
          <p className="lead">{t("home.lead")}</p>
          <div className="hero-actions">
            <Link className="btn btn-dark" to="/menu">
              {t("home.menu")}
            </Link>
            <Link className="btn btn-ghost" to="/stores">
              {t("home.find")}
            </Link>
          </div>
          <ul className="hero-stats">
            <li>
              <strong>{storeCount}</strong>
              <span>{t("home.addresses")}</span>
            </li>
            <li>
              <strong>{itemCount}</strong>
              <span>{t("home.items")}</span>
            </li>
            <li>
              <strong>{categories.length}</strong>
              <span>{t("home.families")}</span>
            </li>
          </ul>
        </div>
        <div className="hero-stage">
          {current ? (
            <Link to={`/menu?item=${current.id}`} className="hero-photo">
              <PhotoFrame src={flavorOf(current).image} alt={text(current.name)} />
              <span>
                {text(current.name)}
                <em>{formatPrice(current.price).replace(" DH", lang === "ar" ? " د.م" : " DH")}</em>
              </span>
            </Link>
          ) : null}
          <p className="hero-mark">
            100
            <span>{t("footer.tag")}</span>
          </p>
        </div>
      </section>

      <div className="marquee" aria-hidden="true">
        <div>
          {categories.concat(categories).map((category, index) => (
            <span key={`${category.id}-${index}`}>{categoryLabel(category.id)}</span>
          ))}
        </div>
      </div>

      <section className="section">
        <div className="section-head">
          <p className="eyebrow">{t("home.grains")}</p>
          <h2>{t("home.grainsTitle")}</h2>
          <p>{t("home.grainsText")}</p>
        </div>
        <div className="bag-grid">
          {bags.map((bag, index) => (
            <article className="bag-card" key={bag.name} style={{ "--i": index }}>
              <img src={bag.src} alt={bag.name} />
              <h3>{bag.name}</h3>
              <p>{t(bag.text)}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section section-tight">
        <div className="section-head">
          <p className="eyebrow">{t("home.sign")}</p>
          <h2>{t("home.signTitle")}</h2>
          <p>{t("home.signText")}</p>
        </div>
        <div className="feature-row">
          {featured.map((entry) => (
            <Link key={entry.id} to={`/menu?item=${entry.id}`} className="feature-card">
              <PhotoFrame src={flavorOf(entry).image} />
              <strong>{text(entry.name)}</strong>
              <em>{formatPrice(entry.price).replace(" DH", lang === "ar" ? " د.م" : " DH")}</em>
            </Link>
          ))}
        </div>
      </section>

      <section className="band">
        <div>
          <p className="eyebrow light">{t("home.network")}</p>
          <h2>{t("home.networkTitle")}</h2>
          <p>{t("home.networkText", { cities: stores.length, stores: storeCount })}</p>
          <Link className="btn btn-light" to="/stores">
            {t("home.seeStores")}
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
          <p className="eyebrow">{t("fr.kicker")}</p>
          <h2>{t("home.frTitle")}</h2>
          <p>{t("home.frText")}</p>
          <Link className="btn btn-dark" to="/franchise">
            {t("nav.franchise")}
          </Link>
        </div>
        <blockquote>
          « {t("home.frQuote")} »
          <cite>{t("home.frCite")}</cite>
        </blockquote>
      </section>
    </>
  );
}
