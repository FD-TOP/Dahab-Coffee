const voices = [
  {
    role: "Direction qualité",
    text: "Nous éprouvons aujourd'hui la volonté de transmettre notre savoir-faire et d'étendre la marque Dahab au Maroc et au-delà. Notre souhait est de fournir à nos franchisés les outils nécessaires pour une gestion efficace et une réussite absolue.",
  },
  {
    role: "Direction administrative et financière",
    text: "Depuis la création de Dahab, dix années se sont écoulées, au cours desquelles d'innombrables aspects du métier ont été explorés pour répondre à l'évolution du marché des cafés au Maroc et aux idées qui ne cessent de grandir.",
  },
  {
    role: "Direction commerciale",
    text: "La franchise est un système par lequel le franchiseur met à disposition d'un indépendant sa marque, son enseigne, son savoir-faire, ainsi qu'un accompagnement et un suivi.",
  },
];

export default function About() {
  return (
    <section className="page">
      <div className="page-intro">
        <p className="eyebrow">À propos</p>
        <h1>Au cœur de la maison</h1>
        <p>
          Dahab Coffee est une maison marocaine de café : grains, boissons, miel, amlou
          et un réseau de stores. Le plaisir tient dans la tasse, et dans la constance.
        </p>
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
        <p className="script">Tout un plaisir !</p>
        <p>Made in Morocco · 05 39 70 75 75 · info@cafesdahab.com</p>
      </div>
    </section>
  );
}
