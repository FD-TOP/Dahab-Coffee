import { useState } from "react";

const empty = { name: "", city: "", phone: "", email: "", message: "" };

export default function Franchise() {
  const [form, setForm] = useState(empty);
  const [sent, setSent] = useState(false);

  function update(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  function submit(event) {
    event.preventDefault();
    setSent(true);
  }

  return (
    <section className="page">
      <div className="page-intro">
        <p className="eyebrow">Franchise</p>
        <h1>Devenir franchisé</h1>
        <p>
          Dahab met à disposition sa marque, son savoir-faire et un accompagnement.
          En contrepartie, le franchisé s'engage sur le cadre de la franchise.
        </p>
      </div>
      <div className="two">
        <ol className="steps">
          <li>
            <strong>La marque</strong>
            <span>Enseigne, recettes et identité Dahab Coffee.</span>
          </li>
          <li>
            <strong>Le savoir-faire</strong>
            <span>Dix années à suivre le marché du café au Maroc.</span>
          </li>
          <li>
            <strong>L'accompagnement</strong>
            <span>Outils de gestion et suivi pour viser une exploitation saine.</span>
          </li>
        </ol>
        {sent ? (
          <div className="thanks">
            <p className="script">Merci</p>
            <h2>Demande enregistrée sur cet écran</h2>
            <p>
              {form.name}, votre message pour {form.city || "votre ville"} est prêt.
              Cette vitrine ne dispose pas encore d'envoi serveur : contactez la maison au
              05 39 70 75 75 ou à info@cafesdahab.com.
            </p>
            <button className="btn btn-dark" onClick={() => { setSent(false); setForm(empty); }}>
              Nouvelle demande
            </button>
          </div>
        ) : (
          <form className="form" onSubmit={submit}>
            <label>
              Nom
              <input name="name" required value={form.name} onChange={update} />
            </label>
            <label>
              Ville envisagée
              <input name="city" required value={form.city} onChange={update} />
            </label>
            <label>
              Téléphone
              <input name="phone" required value={form.phone} onChange={update} />
            </label>
            <label>
              Email
              <input type="email" name="email" required value={form.email} onChange={update} />
            </label>
            <label>
              Projet
              <textarea name="message" rows="4" value={form.message} onChange={update} />
            </label>
            <button className="btn btn-dark" type="submit">
              Envoyer la demande
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
