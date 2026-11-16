import { useState } from "react";
import { useI18n } from "../i18n";

const empty = { name: "", city: "", phone: "", email: "", message: "" };

export default function Franchise() {
  const { t } = useI18n();
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
        <p className="eyebrow">{t("fr.kicker")}</p>
        <h1>{t("fr.title")}</h1>
        <p>{t("fr.lead")}</p>
      </div>
      <div className="two">
        <ol className="steps">
          <li>
            <strong>{t("fr.s1")}</strong>
            <span>{t("fr.s1t")}</span>
          </li>
          <li>
            <strong>{t("fr.s2")}</strong>
            <span>{t("fr.s2t")}</span>
          </li>
          <li>
            <strong>{t("fr.s3")}</strong>
            <span>{t("fr.s3t")}</span>
          </li>
        </ol>
        {sent ? (
          <div className="thanks">
            <p className="script">{t("fr.thanks")}</p>
            <h2>{t("fr.sentTitle")}</h2>
            <p>{t("fr.sent", { name: form.name, city: form.city || t("fr.cityFallback") })}</p>
            <button className="btn btn-dark" onClick={() => { setSent(false); setForm(empty); }}>
              {t("fr.again")}
            </button>
          </div>
        ) : (
          <form className="form" onSubmit={submit}>
            <label>
              {t("fr.name")}
              <input name="name" required value={form.name} onChange={update} />
            </label>
            <label>
              {t("fr.city")}
              <input name="city" required value={form.city} onChange={update} />
            </label>
            <label>
              {t("fr.phone")}
              <input name="phone" required value={form.phone} onChange={update} />
            </label>
            <label>
              {t("fr.email")}
              <input type="email" name="email" required value={form.email} onChange={update} />
            </label>
            <label>
              {t("fr.project")}
              <textarea name="message" rows="4" value={form.message} onChange={update} />
            </label>
            <button className="btn btn-dark" type="submit">
              {t("fr.send")}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
