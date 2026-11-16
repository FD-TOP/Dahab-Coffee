import { useState } from "react";

export default function Join() {
  const [sent, setSent] = useState(false);

  return (
    <section className="page">
      <div className="page-intro">
        <p className="eyebrow">Recrutement</p>
        <h1>Rejoindre un store</h1>
        <p>
          Baristas, équipiers et responsables : Dahab recrute dans son réseau.
          Le portail officiel reste{" "}
          <a href="https://job.dahabcoffee.ma/" target="_blank" rel="noreferrer">
            job.dahabcoffee.ma
          </a>
          .
        </p>
      </div>
      {sent ? (
        <div className="thanks">
          <p className="script">Bien reçu</p>
          <h2>Votre intérêt est noté ici</h2>
          <p>
            Pour déposer un dossier, écrivez à info@cafesdahab.com ou passez par le portail
            de recrutement Dahab.
          </p>
        </div>
      ) : (
        <form
          className="form form-narrow"
          onSubmit={(event) => {
            event.preventDefault();
            setSent(true);
          }}
        >
          <label>
            Nom
            <input name="name" required />
          </label>
          <label>
            Ville
            <input name="city" required />
          </label>
          <label>
            Poste visé
            <input name="role" placeholder="Barista, équipier, responsable…" required />
          </label>
          <label>
            Email
            <input type="email" required />
          </label>
          <label>
            Quelques mots
            <textarea rows="4" />
          </label>
          <button className="btn btn-dark" type="submit">
            Manifester mon intérêt
          </button>
        </form>
      )}
    </section>
  );
}
