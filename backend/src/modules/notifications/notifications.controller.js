// Perimetre complet a la charge de Malick. Stub minimal fourni car le flux
// d'affectation (module Ahma) cree deja des notifications qu'il faut pouvoir lire.
const { Notification } = require('../../models');
const asyncHandler = require('../../utils/asyncHandler');

const list = asyncHandler(async (req, res) => {
  const notifications = await Notification.findAll({
    where: { utilisateur_id: req.user.id },
    order: [['date_creation', 'DESC']],
  });
  res.json(notifications);
});

const markAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findOne({
    where: { id: req.params.id, utilisateur_id: req.user.id },
  });
  if (!notification) return res.status(404).json({ message: 'Notification non trouvee' });

  notification.lu = true;
  await notification.save();
  res.json(notification);
});

module.exports = { list, markAsRead };
