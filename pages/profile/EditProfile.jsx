import { useState, useEffect } from "react";
import userService from "../../api/userService";
import "../../styles/form.css";
import "../../styles/profile.css";

const DEMO_MODE = true;

const PROFIL_DEMO = {
  prenom: "Winter",
  nom: "Ehi",
  email: "winter.ehi@esp.sn",
  telephone: "+221 77 123 45 67",
  role: "Utilisateur",
};

function EditProfile() {
  const [profil, setProfil] = useState({ prenom: "", nom: "", email: "", telephone: "", role: "" });
  const [chargement, setChargement] = useState(true);
  const [erreurs, setErreurs] = useState({});
  const [alerteProfil, setAlerteProfil] = useState(null);
  const [enregistreProfil, setEnregistreProfil] = useState(false);

  const [mdp, setMdp] = useState({ actuel: "", nouveau: "", confirmation: "" });
  const [erreursMdp, setErreursMdp] = useState({});
  const [alerteMdp, setAlerteMdp] = useState(null);
  const [enregistreMdp, setEnregistreMdp] = useState(false);

  useEffect(() => {
    if (DEMO_MODE) {
      setProfil(PROFIL_DEMO);
      setChargement(false);
      return;
    }
    userService
      .getProfil()
      .then((res) => setProfil(res.data))
      .catch(() =>
        setAlerteProfil({ type: "error", texte: "Impossible de charger ton profil." })
      )
      .finally(() => setChargement(false));
  }, []);

  const handleProfil = (e) => {
    const { name, value } = e.target;
    setProfil((prev) => ({ ...prev, [name]: value }));
    setErreurs((prev) => ({ ...prev, [name]: undefined }));
  };

  const validerProfil = () => {
    const e = {};
    if (!profil.prenom.trim()) e.prenom = "Le prénom est obligatoire.";
    if (!profil.nom.trim()) e.nom = "Le nom est obligatoire.";
    if (!profil.email.trim()) e.email = "L'email est obligatoire.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profil.email)) e.email = "Email invalide.";
    return e;
  };

  const enregistrerProfil = async (e) => {
    e.preventDefault();
    setAlerteProfil(null);
    const errs = validerProfil();
    if (Object.keys(errs).length) {
      setErreurs(errs);
      return;
    }
    if (DEMO_MODE) {
      setAlerteProfil({ type: "success", texte: "Profil mis à jour ! (mode démo)" });
      return;
    }
    try {
      setEnregistreProfil(true);
      await userService.modifierProfil(profil);
      setAlerteProfil({ type: "success", texte: "Profil mis à jour !" });
    } catch {
      setAlerteProfil({ type: "error", texte: "Erreur lors de la mise à jour." });
    } finally {
      setEnregistreProfil(false);
    }
  };

  const handleMdp = (e) => {
    const { name, value } = e.target;
    setMdp((prev) => ({ ...prev, [name]: value }));
    setErreursMdp((prev) => ({ ...prev, [name]: undefined }));
  };

  const validerMdp = () => {
    const e = {};
    if (!mdp.actuel) e.actuel = "Saisis ton mot de passe actuel.";
    if (!mdp.nouveau) e.nouveau = "Saisis un nouveau mot de passe.";
    else if (mdp.nouveau.length < 6) e.nouveau = "Au moins 6 caractères.";
    if (mdp.confirmation !== mdp.nouveau)
      e.confirmation = "Les mots de passe ne correspondent pas.";
    return e;
  };

  const changerMdp = async (e) => {
    e.preventDefault();
    setAlerteMdp(null);
    const errs = validerMdp();
    if (Object.keys(errs).length) {
      setErreursMdp(errs);
      return;
    }
    if (DEMO_MODE) {
      setAlerteMdp({ type: "success", texte: "Mot de passe changé ! (mode démo)" });
      setMdp({ actuel: "", nouveau: "", confirmation: "" });
      return;
    }
    try {
      setEnregistreMdp(true);
      await userService.changerMotDePasse({ actuel: mdp.actuel, nouveau: mdp.nouveau });
      setAlerteMdp({ type: "success", texte: "Mot de passe changé !" });
      setMdp({ actuel: "", nouveau: "", confirmation: "" });
    } catch (err) {
      setAlerteMdp({
        type: "error",
        texte: err.response?.data?.message || "Erreur lors du changement.",
      });
    } finally {
      setEnregistreMdp(false);
    }
  };

  if (chargement) {
    return (
      <div className="page">
        <p className="muted">Chargement...</p>
      </div>
    );
  }

  const initiales = `${profil.prenom?.[0] || ""}${profil.nom?.[0] || ""}`.toUpperCase();

  return (
    <div className="page">
      <h1 className="page__title">Mon profil</h1>

      <div className="profile-head card">
        <div className="avatar">{initiales}</div>
        <div>
          <p className="profile-name">
            {profil.prenom} {profil.nom}
          </p>
          <p className="muted">{profil.role}</p>
        </div>
      </div>

      <div className="card" style={{ marginTop: "var(--space-lg)" }}>
        <h2 className="section-title">Informations personnelles</h2>
        {alerteProfil && (
          <div className={`alert alert--${alerteProfil.type}`}>{alerteProfil.texte}</div>
        )}
        <form onSubmit={enregistrerProfil} noValidate>
          <div className="row">
            <div className="field">
              <label className="field__label" htmlFor="prenom">
                Prénom <span className="required">*</span>
              </label>
              <input
                id="prenom"
                name="prenom"
                className={`input ${erreurs.prenom ? "input--error" : ""}`}
                value={profil.prenom}
                onChange={handleProfil}
              />
              {erreurs.prenom && <span className="field__error">{erreurs.prenom}</span>}
            </div>
            <div className="field">
              <label className="field__label" htmlFor="nom">
                Nom <span className="required">*</span>
              </label>
              <input
                id="nom"
                name="nom"
                className={`input ${erreurs.nom ? "input--error" : ""}`}
                value={profil.nom}
                onChange={handleProfil}
              />
              {erreurs.nom && <span className="field__error">{erreurs.nom}</span>}
            </div>
          </div>

          <div className="field">
            <label className="field__label" htmlFor="email">
              Email <span className="required">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className={`input ${erreurs.email ? "input--error" : ""}`}
              value={profil.email}
              onChange={handleProfil}
            />
            {erreurs.email && <span className="field__error">{erreurs.email}</span>}
          </div>

          <div className="field">
            <label className="field__label" htmlFor="telephone">
              Téléphone
            </label>
            <input
              id="telephone"
              name="telephone"
              className="input"
              value={profil.telephone || ""}
              onChange={handleProfil}
            />
          </div>

          <div className="form__actions">
            <button type="submit" className="btn btn--primary" disabled={enregistreProfil}>
              {enregistreProfil ? "Enregistrement..." : "Enregistrer"}
            </button>
          </div>
        </form>
      </div>

      <div className="card" style={{ marginTop: "var(--space-lg)" }}>
        <h2 className="section-title">Changer le mot de passe</h2>
        {alerteMdp && <div className={`alert alert--${alerteMdp.type}`}>{alerteMdp.texte}</div>}
        <form onSubmit={changerMdp} noValidate>
          <div className="field">
            <label className="field__label" htmlFor="actuel">
              Mot de passe actuel
            </label>
            <input
              id="actuel"
              name="actuel"
              type="password"
              className={`input ${erreursMdp.actuel ? "input--error" : ""}`}
              value={mdp.actuel}
              onChange={handleMdp}
            />
            {erreursMdp.actuel && <span className="field__error">{erreursMdp.actuel}</span>}
          </div>

          <div className="row">
            <div className="field">
              <label className="field__label" htmlFor="nouveau">
                Nouveau mot de passe
              </label>
              <input
                id="nouveau"
                name="nouveau"
                type="password"
                className={`input ${erreursMdp.nouveau ? "input--error" : ""}`}
                value={mdp.nouveau}
                onChange={handleMdp}
              />
              {erreursMdp.nouveau && (
                <span className="field__error">{erreursMdp.nouveau}</span>
              )}
            </div>
            <div className="field">
              <label className="field__label" htmlFor="confirmation">
                Confirmer
              </label>
              <input
                id="confirmation"
                name="confirmation"
                type="password"
                className={`input ${erreursMdp.confirmation ? "input--error" : ""}`}
                value={mdp.confirmation}
                onChange={handleMdp}
              />
              {erreursMdp.confirmation && (
                <span className="field__error">{erreursMdp.confirmation}</span>
              )}
            </div>
          </div>

          <div className="form__actions">
            <button type="submit" className="btn btn--primary" disabled={enregistreMdp}>
              {enregistreMdp ? "Modification..." : "Modifier le mot de passe"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProfile;