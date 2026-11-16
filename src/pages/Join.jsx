import { useState } from "react";
import { useI18n } from "../i18n";

export default function Join() {
  const { t } = useI18n();
  const [sent, setSent] = useState(false);

  return (
    <section className="page">
      <div className="page-intro">
        <p className="eyebrow">{t("jobs.kicker")}</p>
        <h1>{t("jobs.title")}</h1>
        <p>
          {t("jobs.lead")}{" "}
          <a href="https://job.dahabcoffee.ma/" target="_blank" rel="noreferrer">
            job.dahabcoffee.ma
          </a>
          .
        </p>
      </div>
      {sent ? (
        <div className="thanks">
          <p className="script">{t("jobs.ok")}</p>
          <h2>{t("jobs.okTitle")}</h2>
          <p>{t("jobs.okText")}</p>
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
            {t("jobs.name")}
            <input name="name" required />
          </label>
          <label>
            {t("jobs.city")}
            <input name="city" required />
          </label>
          <label>
            {t("jobs.role")}
            <input name="role" placeholder={t("jobs.rolePh")} required />
          </label>
          <label>
            {t("fr.email")}
            <input type="email" required />
          </label>
          <label>
            {t("jobs.words")}
            <textarea rows="4" />
          </label>
          <button className="btn btn-dark" type="submit">
            {t("jobs.send")}
          </button>
        </form>
      )}
    </section>
  );
}
