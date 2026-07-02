const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface) => {
    const hash = (plain) => bcrypt.hashSync(plain, 12);

    await queryInterface.bulkInsert('categories', [
      { nom: 'Materiel', description: 'Pannes et problemes materiels', date_creation: new Date() },
      { nom: 'Reseau', description: 'Acces reseau, connexion, VPN', date_creation: new Date() },
      { nom: 'Logiciel', description: 'Bugs et erreurs applicatives', date_creation: new Date() },
      { nom: 'Compte utilisateur', description: 'Comptes, mots de passe, acces', date_creation: new Date() },
    ]);

    await queryInterface.bulkInsert('users', [
      {
        nom: 'Admin Principal',
        email: 'admin@ticketing-esp.sn',
        mot_de_passe: hash('Admin@123'),
        role: 'administrateur',
        actif: true,
        tentatives_echouees: 0,
        date_creation: new Date(),
      },
      {
        nom: 'Technicien Un',
        email: 'tech1@ticketing-esp.sn',
        mot_de_passe: hash('Tech@123'),
        role: 'technicien',
        actif: true,
        tentatives_echouees: 0,
        date_creation: new Date(),
      },
      {
        nom: 'Technicien Deux',
        email: 'tech2@ticketing-esp.sn',
        mot_de_passe: hash('Tech@123'),
        role: 'technicien',
        actif: true,
        tentatives_echouees: 0,
        date_creation: new Date(),
      },
      {
        nom: 'Utilisateur Demo',
        email: 'user@ticketing-esp.sn',
        mot_de_passe: hash('User@123'),
        role: 'utilisateur',
        actif: true,
        tentatives_echouees: 0,
        date_creation: new Date(),
      },
    ]);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('users', null, {});
    await queryInterface.bulkDelete('categories', null, {});
  },
};
