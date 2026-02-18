const ABOUT_HTML = `
  <p>
    Bienvenue sur notre espace aquarium. Cette page présente le projet, son objectif
    et les contenus disponibles pour les visiteurs.
  </p>
  <h2>Ce que vous trouverez ici</h2>
  <ul>
    <li>Des articles publiés sur l'aquariophilie.</li>
    <li>Un annuaire alphabétique des poissons avec leurs fiches.</li>
    <li>Un espace d'administration réservé au backoffice.</li>
  </ul>
  <h2>Objectif du site</h2>
  <p>
    Proposer une base claire et évolutive pour consulter des contenus sur les poissons
    et la maintenance d'un aquarium.
  </p>
`;

export default function AboutPage() {
  return <section className="rich-content" dangerouslySetInnerHTML={{ __html: ABOUT_HTML }} />;
}
