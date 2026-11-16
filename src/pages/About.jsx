import { useI18n } from "../i18n";

export default function About() {
  const { t } = useI18n();
  const voices = [
    { role: t("about.v1r"), text: t("about.v1") },
    { role: t("about.v2r"), text: t("about.v2") },
    { role: t("about.v3r"), text: t("about.v3") },
  ];

  return (
    <section className="page">
      <div className="page-intro">
        <p className="eyebrow">{t("about.kicker")}</p>
        <h1>{t("about.title")}</h1>
        <p>{t("about.lead")}</p>
      </div>
      <div className="voices">
        {voices.map((voice) => (
          <blockquote key={voice.role}>
            <p>{voice.text}</p>
            <cite>{voice.role}</cite>
          </blockquote>
        ))}
      </div>
      <div className="about-band">
        <p className="script">{t("footer.tag")}</p>
        <p>{t("footer.made")} · 05 39 70 75 75 · info@cafesdahab.com</p>
      </div>
    </section>
  );
}
