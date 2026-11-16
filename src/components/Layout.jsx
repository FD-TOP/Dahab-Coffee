import { useState } from "react";
import { NavLink, Outlet, Link } from "react-router-dom";

const links = [
  { to: "/", label: "Accueil", end: true },
  { to: "/menu", label: "Menu" },
  { to: "/stores", label: "Nos stores" },
  { to: "/franchise", label: "Devenir franchisé" },
  { to: "/a-propos", label: "À propos" },
  { to: "/recrutement", label: "Recrutement" },
];

export default function Layout() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="site-header">
        <Link to="/" className="brand" onClick={() => setOpen(false)}>
          <img src="/logo.png" alt="Dahab Coffee" />
        </Link>
        <button
          className={`nav-toggle ${open ? "is-open" : ""}`}
          aria-expanded={open}
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          onClick={() => setOpen((value) => !value)}
        >
          <span />
          <span />
          <span />
        </button>
        <nav className={open ? "is-open" : ""}>
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
      <footer className="site-footer">
        <div className="footer-grid">
          <div>
            <img src="/logo.png" alt="" className="footer-logo" />
            <p className="script">Tout un plaisir !</p>
            <p>Made in Morocco</p>
          </div>
          <div>
            <h2>La maison</h2>
            <Link to="/menu">Menu interactif</Link>
            <Link to="/stores">Nos stores</Link>
            <Link to="/franchise">Franchise</Link>
            <Link to="/a-propos">À propos</Link>
          </div>
          <div>
            <h2>Contact</h2>
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
        <p className="legal">© {new Date().getFullYear()} Dahab Coffee · Vitrine</p>
      </footer>
    </>
  );
}
