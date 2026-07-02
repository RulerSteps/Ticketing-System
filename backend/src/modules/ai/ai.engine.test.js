const { analyzeTicket } = require('./ai.engine');

describe('ai.engine.analyzeTicket', () => {
  test('detecte un ticket CRITIQUE (exemple du CDC)', () => {
    const result = analyzeTicket(
      'Panne serveur',
      'Le serveur de messagerie est en panne, tous les employes sont bloques depuis ce matin'
    );
    expect(result.criticite).toBe('CRITIQUE');
    expect(result.score).toBe(100);
  });

  test('detecte un ticket HAUTE', () => {
    const result = analyzeTicket(
      'Messagerie en panne',
      'La messagerie interne ne fonctionne plus pour tout le departement RH'
    );
    expect(result.criticite).toBe('HAUTE');
  });

  test('detecte un ticket MOYENNE', () => {
    const result = analyzeTicket(
      "Bug application",
      "L'application de facturation plante quand j'essaie d'enregistrer"
    );
    expect(result.criticite).toBe('MOYENNE');
  });

  test('detecte un ticket BASSE', () => {
    const result = analyzeTicket(
      'Changement de langue',
      'Je voudrais changer la langue de mon interface Microsoft Office'
    );
    expect(result.criticite).toBe('BASSE');
  });

  test('ticket sans mot-cle retombe sur BASSE avec score 0', () => {
    const result = analyzeTicket('Question generale', 'Bonjour, juste une question administrative');
    expect(result.criticite).toBe('BASSE');
    expect(result.score).toBe(0);
  });

  test('ignore les accents dans le texte du ticket', () => {
    const result = analyzeTicket('Réseau', "Le réseau est complètement inaccessible, tout le monde est bloqué");
    expect(result.criticite).toBe('CRITIQUE');
  });
});
