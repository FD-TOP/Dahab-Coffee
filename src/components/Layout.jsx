import { useState } from "react";
import { NavLink, Outlet, Link } from "react-router-dom";
import { useI18n } from "../i18n";

const links = [
  { to: "/", key: "nav.home", end: true },
  { to: "/menu", key: "nav.menu" },
  { to: "/stores", key: "nav.stores" },
  { to: "/franchise", key: "nav.franchise" },
  { to: "/a-propos", key: "nav.about" },
  { to: "/recrutement", key: "nav.jobs" },
];

const langs = [
  { id: "fr", label: "FR" },
  { id: "ar", label: "عر" },
  { id: "en", label: "EN" },
];

export default function Layout() {
  const [open, setOpen] = useState(false);
  const { t, lang, setLang } = useI18n();

  return (
    <>
      <header className="site-header">
        <Link to="/" className="brand" onClick={() => setOpen(false)}>
          <img src="/logo.png" alt="Dahab Coffee" />
        </Link>
        <nav className={open ? "is-open" : ""}>
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end} onClick={() => setOpen(false)}>
              {t(link.key)}
            </NavLink>
          ))}
        </nav>
        <div className="header-tools">
          <div className="langs" role="group" aria-label="Language">
            {langs.map((item) => (
              <button
                key={item.id}
                className={lang === item.id ? "is-on" : ""}
                onClick={() => setLang(item.id)}
                aria-pressed={lang === item.id}
              >
                {item.label}
              </button>
            ))}
          </div>
          <button
            className={`nav-toggle ${open ? "is-open" : ""}`}
            aria-expanded={open}
            aria-label={open ? t("nav.close") : t("nav.open")}
            onClick={() => setOpen((value) => !value)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
      <footer className="site-footer">
        <div className="footer-grid">
          <div>
            <img src="/logo.png" alt="" className="footer-logo" />
            <p className="script">{t("footer.tag")}</p>
            <p>{t("footer.made")}</p>
          </div>
          <div>
            <h2>{t("footer.house")}</h2>
            <Link to="/menu">{t("footer.menu")}</Link>
            <Link to="/stores">{t("footer.stores")}</Link>
            <Link to="/franchise">{t("footer.franchise")}</Link>
            <Link to="/a-propos">{t("footer.about")}</Link>
          </div>
          <div>
            <h2>{t("footer.contact")}</h2>
            <a href="tel:+212539707575">05 39 70 75 75</a>
            <a href="mailto:info@cafesdahab.com">info@cafesdahab.com</a>
            <a href="https://www.instagram.com/dahab.coffee/" target="_blank" rel="noreferrer">
              Instagram
            </a>
            <a href="https://www.facebook.com/dahab.industrie" target="_blank" rel="noreferrer">
              Facebook
            </a>
          </div>
        </div>
        <p className="legal">© {new Date().getFullYear()} Dahab Coffee · {t("footer.legal")}</p>
      </footer>
    </>
  );
}
