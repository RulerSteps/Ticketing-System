import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ticketService from "../../api/ticketService";
import categoryService from "../../api/categoryService";
import { PRIORITES } from "../../constants/ticketEnums";
import "../../styles/form.css";

// 👇 Tant que le backend n'est pas prêt, laisse ceci sur true.
const DEMO_MODE = true;

const CATEGORIES_DEMO = [
  { id: 1, nom: "Matériel" },
  { id: 2, nom: "Réseau" },
  { id: 3, nom: "Logiciel" },
  { id: 4, nom: "Messagerie" },
  { id: 5, nom: "Accès / Comptes" },
];

function CreateTicket() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    titre: "",
    description: "",
    categorie_id: "",
    priorite: "moyenne",
  });
  const [fichier, setFichier] = useState(null);

  const [categories, setCategories] = useState([]);
  const [erreurs, setErreurs] = useState({});
  const [alerte, setAlerte] = useState(null);
  const [envoiEnCours, setEnvoiEnCours] = useState(false);

  useEffect(() => {
    if (DEMO_MODE) {
      setCategories(CATEGORIES_DEMO);
      return;
    }
    categoryService
      .lister()
      .then((res) => setCategories(res.data))
      .catch(() =>
        setAlerte({
          type: "error",
          texte: "Impossible de charger les catégories. Réessaie plus tard.",
        })
      );
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErreurs((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleFichier = (e) => {
    setFichier(e.target.files[0] || null);
  };

  const valider = () => {
    const e = {};
    if (!form.titre.trim()) e.titre = "Le titre est obligatoire.";
    else if (form.titre.trim().length < 5)
      e.titre = "Le titre doit faire au moins 5 caractères.";

    if (!form.description.trim()) e.description = "La description est obligatoire.";
    if (!form.categorie_id) e.categorie_id = "Choisis une catégorie.";
    return e;
  };

  const reinitialiser = () => {
    setForm({ titre: "", description: "", categorie_id: "", priorite: "moyenne" });
    setFichier(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlerte(null);

    const erreursValidation = valider();
    if (Object.keys(erreursValidation).length > 0) {
      setErreurs(erreursValidation);
      return;
    }

    if (DEMO_MODE) {
      setAlerte({ type: "success", texte: "Ticket créé avec succès ! (mode démo)" });
      reinitialiser();
      return;
    }

    const data = new FormData();
    data.append("titre", form.titre);
    data.append("description", form.description);
    data.append("categorie_id", form.categorie_id);
    data.append("priorite", form.priorite);
    if (fichier) data.append("piece_jointe", fichier);

    try {
      setEnvoiEnCours(true);
      const res = await ticketService.creer(data);
      setAlerte({ type: "success", texte: "Ticket créé avec succès !" });
      const nouvelId = res.data?.id;
      setTimeout(() => {
        navigate(nouvelId ? `/tickets/${nouvelId}` : "/tickets");
      }, 800);
    } catch (err) {
      setAlerte({
        type: "error",
        texte:
          err.response?.data?.message ||
          "Une erreur est survenue lors de la création du ticket.",
      });
    } finally {
      setEnvoiEnCours(false);
    }
  };

  return (
    <div className="page">
      <h1 className="page__title">Créer un ticket</h1>

      <div className="card">
        {alerte && <div className={`alert alert--${alerte.type}`}>{alerte.texte}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label className="field__label" htmlFor="titre">
              Titre <span className="required">*</span>
            </label>
            <input
              id="titre"
              name="titre"
              type="text"
              className={`input ${erreurs.titre ? "input--error" : ""}`}
              placeholder="Ex : Imprimante du 2e étage hors service"
              value={form.titre}
              onChange={handleChange}
            />
            {erreurs.titre && <span className="field__error">{erreurs.titre}</span>}
          </div>

          <div className="field">
            <label className="field__label" htmlFor="description">
              Description <span className="required">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              className={`textarea ${erreurs.description ? "textarea--error" : ""}`}
              placeholder="Décris le problème : que se passe-t-il, depuis quand, message d'erreur..."
              value={form.description}
              onChange={handleChange}
            />
            {erreurs.description && (
              <span className="field__error">{erreurs.description}</span>
            )}
          </div>

          <div className="row">
            <div className="field">
              <label className="field__label" htmlFor="categorie_id">
                Catégorie <span className="required">*</span>
              </label>
              <select
                id="categorie_id"
                name="categorie_id"
                className={`select ${erreurs.categorie_id ? "select--error" : ""}`}
                value={form.categorie_id}
                onChange={handleChange}
              >
                <option value="">— Choisir —</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nom}
                  </option>
                ))}
              </select>
              {erreurs.categorie_id && (
                <span className="field__error">{erreurs.categorie_id}</span>
              )}
            </div>

            <div className="field">
              <label className="field__label" htmlFor="priorite">
                Priorité
              </label>
              <select
                id="priorite"
                name="priorite"
                className="select"
                value={form.priorite}
                onChange={handleChange}
              >
                {PRIORITES.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="field">
            <label className="field__label" htmlFor="piece_jointe">
              Pièce jointe
            </label>
            <input
              id="piece_jointe"
              name="piece_jointe"
              type="file"
              className="input"
              onChange={handleFichier}
            />
            <span className="file-hint">
              Facultatif — capture d'écran, photo du problème, etc.
            </span>
          </div>

          <div className="form__actions">
            <button
              type="button"
              className="btn btn--ghost"
              onClick={reinitialiser}
              disabled={envoiEnCours}
            >
              Réinitialiser
            </button>
            <button type="submit" className="btn btn--primary" disabled={envoiEnCours}>
              {envoiEnCours ? "Création..." : "Créer le ticket"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateTicket;