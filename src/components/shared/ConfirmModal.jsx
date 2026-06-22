/**
 * ConfirmModal.jsx — Modal de confirmation générique et réutilisable
 * Props :
 *   isOpen    : boolean  — contrôle l'affichage
 *   message   : string   — texte de la question de confirmation
 *   onConfirm : function — callback si l'utilisateur confirme
 *   onCancel  : function — callback si l'utilisateur annule
 */

const ConfirmModal = ({ isOpen, message, onConfirm, onCancel }) => {
  // Ne rien rendre si le modal est fermé
  if (!isOpen) return null;

  return (
    /* Fond sombre semi-transparent */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onCancel} // Ferme en cliquant en dehors
    >
      {/* Boîte du modal — stopPropagation évite la fermeture au clic intérieur */}
      <div
        className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-4 animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Icône d'avertissement */}
        <div className="flex items-center justify-center mb-4">
          <div className="bg-red-100 rounded-full p-3">
            <svg className="w-7 h-7 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
          </div>
        </div>

        {/* Message */}
        <p className="text-center text-gray-700 text-base font-medium mb-6">{message}</p>

        {/* Boutons */}
        <div className="flex gap-3 justify-center">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-50 transition font-medium"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 transition font-medium"
          >
            Confirmer
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
