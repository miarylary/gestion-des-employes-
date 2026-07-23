import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, NavLink, Navigate } from 'react-router-dom';

const css = `
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Segoe UI', sans-serif; background: #f3f4f6; color: #bc8505cf; min-height:100vh; }

:root {
  --primary: #1bc0c9d4;
  --primary-light: #10a29886;
  --primary-dark: #0b8989a9;
  --primary-gradient: linear-gradient(135deg, #c29f15b5, #a44b22cc);
  --sidebar-width: 240px;
  --bg-light: #f3f4f6;
  --border-color: #e5e7eb;
  --text-muted: #1a1b1c39;
  --card-shadow: 0 4px 16px rgba(179, 123, 33, 0.6);
  --card-hover: 0 8px 30px rgba(181, 95, 29, 0.57);
}

/* --- SIDEBAR GAUCHE --- */
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: var(--sidebar-width);
  height: 100vh;
  background: var(--primary);
  color: #fff;
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
  z-index: 1000;
  box-shadow: 2px 0 12px rgba(2, 19, 16, 0.05);
  transition: transform 0.3s ease;
}
.sidebar-brand {
  font-size: 20px;
  font-weight: 800;
  padding: 8px 0 24px 12px;
  border-bottom: 1px solid rgba(13, 173, 157, 0.51);
  margin-bottom: 24px;
  letter-spacing: -0.5px;
}
.sidebar-brand span { color: #11141810; font-weight: 300; }
.sidebar-menu {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.sidebar-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 10px;
  color: rgba(255, 255, 255, 0.98);
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.2s;
}
.sidebar-link:hover {
  background: rgba(212, 176, 131, 0.58);
  color: #fff;
}
.sidebar-link.active {
  background: #fff;
  color: var(--primary);
}
.sidebar-link .icon { font-size: 18px; width: 24px; text-align: center; }
.sidebar-footer {
  border-top: 1px solid rgba(227, 212, 212, 0.79);
  padding-top: 16px;
}
.sidebar-user {
  font-size: 13px;
  color: rgba(255,255,255,0.6);
  padding: 8px 12px;
  margin-bottom: 8px;
}
.sidebar-logout {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 12px 16px;
  border: none;
  border-radius: 10px;
  background: rgba(255,255,255,0.05);
  color: rgba(255,255,255,0.7);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.sidebar-logout:hover {
  background: rgba(255,255,255,0.15);
  color: #fff;
}
.sidebar-logout .icon { font-size: 18px; width: 24px; text-align: center; }

/* --- CONTENU PRINCIPAL --- */
.main {
  margin-left: var(--sidebar-width);
  max-width: calc(1100px - var(--sidebar-width));
  padding: 40px 32px;
  min-height: 100vh;
}

/* --- LOGIN (PAGE PLEINE) --- */
.home-wrap { display:flex; justify-content:center; align-items:center; min-height:100vh; background:linear-gradient(135deg, #f3f4f6ad 0%, #e5e7eb 100%); }
.login-card { background:#fff; border-radius:20px; border:1px solid var(--border-color); padding:48px; width:100%; max-width:440px; text-align:center; box-shadow:0 8px 32px rgba(0,0,0,0.08); }
.login-logo { width:72px; height:72px; background:var(--primary-gradient); border-radius:20px; display:flex; align-items:center; justify-content:center; font-size:36px; margin:0 auto 20px; box-shadow:0 8px 24px rgba(31,41,55,0.25); }
.login-card h1 { font-size:26px; font-weight:800; color::#0a1a2e; margin-bottom:6px; }
.login-card .subtitle { font-size:14px; color:#1a202c; margin-bottom:32px; }
.divider { display:flex; align-items:center; gap:12px; margin:20px 0; color:var(--text-muted); font-size:13px; }
.divider::before, .divider::after { content:''; flex:1; height:1px; background:var(--border-color); }

/* --- DASHBOARD --- */
.dashboard-header { margin-bottom:32px; }
.dashboard-header h1 { font-size:32px; font-weight:800; color:#0f2440; margin-bottom:4px; }
.dashboard-header p { font-size:16px; color:var(--text-muted); }

.dashboard { display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:24px; margin-top:8px; }
.dashboard-card {
  background:#fff;
  border-radius:16px;
  padding:28px 24px 24px;
  border:1px solid var(--border-color);
  box-shadow:var(--card-shadow);
  cursor:pointer;
  transition:all 0.3s ease;
  text-decoration:none;
  color:inherit;
  display:block;
}
.dashboard-card:hover {
  transform:translateY(-6px);
  box-shadow:var(--card-hover);
  border-color:#d1d5db;
}
.dashboard-card-icon { font-size:36px; margin-bottom:12px; display:block; }
.dashboard-card-title { font-size:18px; font-weight:700; color:#1a365d; margin-bottom:6px; }
.dashboard-card-desc { font-size:14px; color:#b91c1c; line-height:1.5; }
.dashboard-card-badge { display:inline-block; margin-top:12px; font-size:12px; font-weight:600; color:var(--primary); background:#f3f4f6; padding:2px 12px; border-radius:12px; }

/* --- CARTES STANDARD --- */
.card { background:#fff; border-radius:16px; border:1px solid var(--border-color); padding:32px; margin-bottom:24px; box-shadow:var(--card-shadow); transition:box-shadow 0.3s; }
.card:hover { box-shadow:var(--card-hover); }

.page-title { font-size:24px; font-weight:800; color:var(--primary); margin-bottom:28px; display:flex; align-items:center; gap:10px; }
.page-title::after { content:''; flex:1; height:2px; background:linear-gradient(to right, var(--border-color), transparent); }

.form-group { display:flex; flex-direction:column; gap:6px; margin-bottom:22px; }
.form-group label { font-size:12px; font-weight:700; color:#b91c1c; text-transform:uppercase; letter-spacing:0.8px; }
.form-group input { padding:12px 16px; background:#f9fafb; border:1.5px solid var(--border-color); border-radius:10px; font-size:15px; color:#1a202c; outline:none; transition:all 0.25s; }
.form-group input:focus { border-color:var(--primary); background:#fff; box-shadow:0 0 0 3px rgba(31,41,55,0.08); }
.form-group input::placeholder { color:var(--text-muted); }
.form-group select { padding:12px 16px; background:#f9fafb; border:1.5px solid var(--border-color); border-radius:10px; font-size:15px; color:#1a202c; outline:none; transition:all 0.25s; }
.form-group select:focus { border-color:var(--primary); background:#fff; box-shadow:0 0 0 3px rgba(31,41,55,0.08); }

.password-wrapper { position:relative; display:flex; align-items:center; }
.password-wrapper input { width:100%; padding:12px 48px 12px 16px; background:#f9fafb; border:1.5px solid var(--border-color); border-radius:10px; font-size:15px; color:#1a202c; outline:none; transition:all 0.25s; }
.password-wrapper input:focus { border-color:var(--primary); background:#fff; box-shadow:0 0 0 3px rgba(31,41,55,0.08); }
.password-wrapper input::placeholder { color:var(--text-muted); }
.eye-btn { position:absolute; right:14px; background:none; border:none; cursor:pointer; font-size:18px; color:var(--text-muted); padding:0; }
.eye-btn:hover { color:var(--primary); }

.btn { display:inline-flex; align-items:center; gap:6px; padding:10px 24px; border:none; border-radius:10px; font-size:14px; font-weight:700; cursor:pointer; transition:all 0.25s; }
.btn:hover { transform:translateY(-2px); box-shadow:0 6px 20px rgba(0,0,0,0.12); }
.btn:active { transform:translateY(0); }
.btn-primary { background:var(--primary-gradient); color:#fff; }
.btn-danger { background:linear-gradient(135deg, #ef4444, #dc2626); color:#fff; }
.btn-warning { background:linear-gradient(135deg, #f59e0b, #d97706); color:#fff; }
.btn-success { background:linear-gradient(135deg, #10b981c2, #059668ba); color:#fff; }
.btn-gray { background:#f3f4f6; color:var(--primary); border:1px solid var(--border-color); }
.btn-gray:hover { background:#e5e7eb; }
.btn-outline { background:none; border:2px solid var(--primary); color:var(--primary); border-radius:10px; padding:10px 24px; font-size:14px; font-weight:700; cursor:pointer; transition:all 0.25s; display:inline-flex; align-items:center; gap:6px; }
.btn-outline:hover { background:var(--primary); color:#fff; }
.btn-link { background:none; border:none; color:var(--primary); font-size:13px; font-weight:600; cursor:pointer; text-decoration:underline; padding:0; }
.btn-link:hover { color:var(--primary-light); }

.btn-pill { padding:5px 14px; border-radius:20px; font-size:12px; font-weight:700; border:none; cursor:pointer; transition:all 0.2s; display:inline-flex; align-items:center; gap:4px; }
.btn-pill:hover { transform:translateY(-1px); box-shadow:0 4px 10px rgba(0,0,0,0.1); }
.btn-pill-warning { background:#fef3c7; color:#92400e; }
.btn-pill-warning:hover { background:#f59e0b; color:#fff; }
.btn-pill-danger { background:#fee2e2; color:#991b1b; }
.btn-pill-danger:hover { background:#ef4444; color:#fff; }

.alert { padding:14px 18px; border-radius:10px; font-size:14px; font-weight:600; margin-bottom:24px; display:flex; align-items:center; gap:10px; }
.alert-success { background:#1f2937; color:#f9fafb; border:1px solid #ea4166; }
.alert-error { background:#fef2f2; color:#991b1b; border:1px solid #fca5a5df; }

/* --- TABLEAU --- */
.table-wrap { border-radius:12px; overflow:hidden; border:1px solid var(--border-color); box-shadow:0 2px 8px rgba(0,0,0,0.04); }
table { width:100%; border-collapse:collapse; font-size:14px; }
th { background:var(--primary); color:#fff; font-weight:600; padding:14px 18px; text-align:left; font-size:11px; text-transform:uppercase; letter-spacing:0.8px; }
td { padding:14px 18px; border-bottom:1px solid #f3f4f6; color:#374151; }
tbody tr:nth-child(even) td { background:#fafafa; }
tbody tr:last-child td { border-bottom:none; }
tr:hover td { background:#f3f4f6; cursor:default; }

.badge { display:inline-flex; align-items:center; gap:6px; padding:4px 14px; border-radius:20px; font-size:12px; font-weight:700; }
.badge-mediocre { background:#fee2e2; color:#991b1b; border:1px solid #fca5a5; }
.badge-moyen { background:#fef3c7; color:#92400e; border:1px solid #fcd34d; }
.badge-grand { background:#d1fae5; color:#065f46; border:1px solid #6ee7b76d; }
.badge-dot { display:inline-block; width:8px; height:8px; border-radius:50%; }
.badge-mediocre .badge-dot { background:#ef4444; }
.badge-moyen .badge-dot { background:#f59e0b; }
.badge-grand .badge-dot { background:#10b981; }

.action-buttons { display:flex; gap:6px; }

.stat-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(160px,1fr)); gap:16px; margin-bottom:28px; }
.stat-card { background:#fff; border-radius:14px; padding:20px; text-align:center; border:1px solid var(--border-color); transition:all 0.2s; box-shadow:0 2px 8px rgba(0,0,0,0.04); }
.stat-card:hover { border-color:var(--primary); transform:translateY(-2px); box-shadow:0 4px 16px rgba(0,0,0,0.08); }
.stat-value { font-size:24px; font-weight:800; color:var(--primary); }
.stat-label { font-size:12px; color:var(--text-muted); margin-top:6px; font-weight:600; text-transform:uppercase; letter-spacing:0.5px; }

/* --- MODALES --- */
.modal-overlay { position:fixed; inset:0; background:rgba(31,41,55,0.4); display:flex; align-items:center; justify-content:center; z-index:200; backdrop-filter:blur(4px); }
.modal { background:#fff; border-radius:16px; padding:36px; width:100%; max-width:460px; border:1px solid var(--border-color); box-shadow:0 8px 32px rgba(0,0,0,0.15); max-height:90vh; overflow-y:auto; }
.modal h2 { font-size:20px; font-weight:800; margin-bottom:8px; color:var(--primary); }
.modal-actions { display:flex; gap:12px; margin-top:24px; justify-content:flex-end; }

.modal-confirm-icon { font-size:48px; text-align:center; margin-bottom:12px; }
.modal-confirm-message { text-align:center; font-size:16px; color:#374151; margin-bottom:8px; }
.modal-confirm-name { text-align:center; font-size:20px; font-weight:800; color:var(--primary); margin-bottom:20px; }
.modal-confirm-actions { display:flex; gap:12px; justify-content:center; margin-top:8px; }

.search-input { width:100%; padding:12px 16px; background:#f9fafb; border:1.5px solid var(--border-color); border-radius:10px; font-size:15px; color:#1a202c; outline:none; transition:all 0.25s; }
.search-input:focus { border-color:var(--primary); background:#fff; box-shadow:0 0 0 3px rgba(31,41,55,0.08); }
.search-input::placeholder { color:var(--text-muted); }

.info-box { background:#f9fafb; border:1px solid var(--border-color); border-left:4px solid var(--primary); border-radius:0 10px 10px 0; padding:12px 16px; font-size:13px; color:var(--primary); margin-bottom:24px; }

/* === PAGE AJOUT SANS IMAGE === */
.page-add-wrapper {
  background: #f2e3e3;
  border-radius:20px;
  padding:48px 40px;
  position:relative;
  box-shadow:0 4px 16px rgba(238, 231, 225, 0.93);
  border:1px solid #f5d0c5b2;
}
.page-add-overlay {
  display:none;
}
.page-add-content {
  position:relative;
  z-index:2;
}
.add-badge {
  display:inline-flex;
  align-items:center;
  gap:10px;
  background:var(--primary);
  color:#fff;
  padding:6px 20px;
  border-radius:20px;
  font-size:12px;
  font-weight:600;
  text-transform:uppercase;
  letter-spacing:0.8px;
  margin-bottom:16px;
}
`;

const API = 'http://localhost/employe/backend';

const ADMIN_QUESTION = 'Quel est le nom de votre école ?';
const ADMIN_REPONSE = 'eni';

const QUESTIONS = [
  'Quel est le nom de votre école ?',
  'Quel est le prénom de votre mère ?',
  'Quel est votre animal préféré ?',
  'Dans quelle ville êtes-vous né(e) ?',
  'Quel est votre plat préféré ?',
];

function getUsers() {
  try { return JSON.parse(localStorage.getItem('users') || '[]'); }
  catch { return []; }
}
function saveUsers(u) { localStorage.setItem('users', JSON.stringify(u)); }
function getAdminPassword() { return localStorage.getItem('adminPassword') || 'admin123'; }
function saveAdminPassword(p) { localStorage.setItem('adminPassword', p); }

// ========== INSCRIPTION ==========
function RegisterPage({ onBack, onSuccess }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [pass2, setPass2] = useState('');
  const [question, setQuestion] = useState(QUESTIONS[0]);
  const [reponse, setReponse] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [err, setErr] = useState('');

  function submit(e) {
    e.preventDefault(); setErr('');

    if (username.trim().length < 3) { setErr('❌ Nom trop court (min 3 caractères)'); return; }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) { setErr('❌ Email invalide'); return; }
    if (pass.length < 6) { setErr('❌ Mot de passe trop court (min 6 caractères)'); return; }
    if (pass !== pass2) { setErr('❌ Les deux mots de passe ne correspondent pas'); return; }
    if (reponse.trim().length < 2) { setErr('❌ Réponse secrète trop courte'); return; }

    const users = getUsers();
    if (username.toLowerCase() === 'admin') { setErr('❌ Ce nom est réservé'); return; }
    if (users.find(u => u.username.toLowerCase() === username.toLowerCase())) {
      setErr('❌ Nom déjà pris');
      return;
    }
    if (users.find(u => u.email && u.email.toLowerCase() === email.trim().toLowerCase())) {
      setErr('❌ Cet email est déjà associé à un compte');
      return;
    }

    users.push({
      username: username.trim(),
      email: email.trim(),
      password: pass,
      question,
      reponse: reponse.trim().toLowerCase(),
    });
    saveUsers(users);
    onSuccess(username.trim());
  }

  return (
    <div className="home-wrap">
      <div className="login-card" style={{maxWidth:480}}>
        <div className="login-logo">📝</div>
        <h1>Créer un compte</h1>
        <p className="subtitle">Remplissez le formulaire pour vous inscrire</p>
        {err && <div className="alert alert-error">{err}</div>}
        <form onSubmit={submit}>
          <div className="form-group" style={{textAlign:'left'}}>
            <label>Nom d'utilisateur</label>
            <input value={username} onChange={e=>setUsername(e.target.value)} placeholder="Ex: john_doe" required />
          </div>
          <div className="form-group" style={{textAlign:'left'}}>
            <label>Email</label>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="john@example.com" required />
          </div>
          <div className="form-group" style={{textAlign:'left'}}>
            <label>Mot de passe</label>
            <div className="password-wrapper">
              <input type={showPwd?'text':'password'} value={pass} onChange={e=>setPass(e.target.value)} placeholder="Minimum 6 caractères" required />
              <button type="button" className="eye-btn" onClick={()=>setShowPwd(!showPwd)}>{showPwd?'🙈':'👁️'}</button>
            </div>
          </div>
          <div className="form-group" style={{textAlign:'left'}}>
            <label>Confirmer le mot de passe</label>
            <input type="password" value={pass2} onChange={e=>setPass2(e.target.value)} placeholder="Répétez le mot de passe" required />
          </div>
          <div className="form-group" style={{textAlign:'left'}}>
            <label>Question secrète</label>
            <select value={question} onChange={e=>setQuestion(e.target.value)}>
              {QUESTIONS.map(q=><option key={q} value={q}>{q}</option>)}
            </select>
          </div>
          <div className="form-group" style={{textAlign:'left'}}>
            <label>Votre réponse secrète</label>
            <input value={reponse} onChange={e=>setReponse(e.target.value)} placeholder="Réponse à votre question" required />
          </div>
          <button type="submit" className="btn btn-primary" style={{width:'100%',justifyContent:'center',padding:'13px',fontSize:'15px'}}>
            ✅ Créer mon compte
          </button>
          <div className="divider">ou</div>
          <button type="button" className="btn-outline" style={{width:'100%',justifyContent:'center',padding:'11px'}} onClick={onBack}>
            ← Retour à la connexion
          </button>
        </form>
      </div>
    </div>
  );
}

// ========== MOT DE PASSE OUBLIÉ ==========
function ForgotPage({ onBack }) {
  const [etape, setEtape] = useState(1);
  const [forgotUser, setForgotUser] = useState('');
  const [reponse, setReponse] = useState('');
  const [newPass, setNewPass] = useState('');
  const [newPass2, setNewPass2] = useState('');
  const [foundUser, setFoundUser] = useState(null);
  const [err, setErr] = useState('');

  function verifierUser(e) {
    e.preventDefault(); setErr('');
    if (forgotUser.toLowerCase() === 'admin') {
      setFoundUser({ username:'admin', question:ADMIN_QUESTION, reponse:ADMIN_REPONSE, isAdmin:true });
      setEtape(2); return;
    }
    const users = getUsers();
    const found = users.find(u => u.username.toLowerCase() === forgotUser.toLowerCase());
    if (!found) { setErr('❌ Utilisateur introuvable'); return; }
    setFoundUser(found); setEtape(2);
  }

  function verifierReponse(e) {
    e.preventDefault(); setErr('');
    if (reponse.trim().toLowerCase() === foundUser.reponse) { setEtape(3); }
    else setErr('❌ Réponse incorrecte. Essayez encore.');
  }

  function reinitialiserMdp(e) {
    e.preventDefault(); setErr('');
    if (newPass.length < 6) { setErr('❌ Minimum 6 caractères'); return; }
    if (newPass !== newPass2) { setErr('❌ Les mots de passe ne correspondent pas'); return; }
    if (foundUser.isAdmin) { saveAdminPassword(newPass); }
    else {
      const users = getUsers();
      const idx = users.findIndex(u => u.username === foundUser.username);
      users[idx].password = newPass;
      saveUsers(users);
    }
    setEtape(4);
  }

  return (
    <div className="home-wrap">
      <div className="login-card" style={{maxWidth:460}}>
        {etape === 1 && (
          <>
            <div className="login-logo">🔑</div>
            <h1>Mot de passe oublié</h1>
            <p className="subtitle">Entrez votre nom d'utilisateur</p>
            {err && <div className="alert alert-error">{err}</div>}
            <form onSubmit={verifierUser}>
              <div className="form-group" style={{textAlign:'left'}}>
                <label>Nom d'utilisateur</label>
                <input value={forgotUser} onChange={e=>setForgotUser(e.target.value)} placeholder="Votre nom d'utilisateur" required autoFocus />
              </div>
              <button type="submit" className="btn btn-primary" style={{width:'100%',justifyContent:'center',padding:'13px'}}>Continuer →</button>
              <div className="divider">ou</div>
              <button type="button" className="btn-outline" style={{width:'100%',justifyContent:'center',padding:'11px'}} onClick={onBack}>← Retour</button>
            </form>
          </>
        )}
        {etape === 2 && (
          <>
            <div className="login-logo">💬</div>
            <h1>Question secrète</h1>
            <p className="subtitle">Répondez à votre question secrète</p>
            {err && <div className="alert alert-error">{err}</div>}
            <form onSubmit={verifierReponse}>
              <div className="form-group" style={{textAlign:'left'}}>
                <label>Votre question</label>
                <div style={{padding:'12px 16px',background:'#f9fafb',borderRadius:10,fontSize:14,color:'var(--primary)',border:'1px solid var(--border-color)'}}>
                  💬 {foundUser?.question}
                </div>
              </div>
              <div className="form-group" style={{textAlign:'left'}}>
                <label>Votre réponse</label>
                <input value={reponse} onChange={e=>setReponse(e.target.value)} placeholder="Tapez votre réponse..." required autoFocus />
              </div>
              <button type="submit" className="btn btn-primary" style={{width:'100%',justifyContent:'center',padding:'13px'}}>Vérifier →</button>
            </form>
          </>
        )}
        {etape === 3 && (
          <>
            <div className="login-logo">🔒</div>
            <h1>Nouveau mot de passe</h1>
            <p className="subtitle">✅ Réponse correcte !</p>
            {err && <div className="alert alert-error">{err}</div>}
            <form onSubmit={reinitialiserMdp}>
              <div className="form-group" style={{textAlign:'left'}}>
                <label>Nouveau mot de passe</label>
                <input type="password" value={newPass} onChange={e=>setNewPass(e.target.value)} placeholder="Minimum 6 caractères" required autoFocus />
              </div>
              <div className="form-group" style={{textAlign:'left'}}>
                <label>Confirmer</label>
                <input type="password" value={newPass2} onChange={e=>setNewPass2(e.target.value)} placeholder="Répétez le mot de passe" required />
              </div>
              <button type="submit" className="btn btn-primary" style={{width:'100%',justifyContent:'center',padding:'13px'}}>💾 Réinitialiser</button>
            </form>
          </>
        )}
        {etape === 4 && (
          <>
            <div className="login-logo">✅</div>
            <h1>Mot de passe réinitialisé !</h1>
            <p className="subtitle">Connectez-vous avec votre nouveau mot de passe.</p>
            <button className="btn btn-primary" style={{width:'100%',justifyContent:'center',padding:'13px',marginTop:16}} onClick={onBack}>
              🚀 Se connecter
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ========== LOGIN ==========
function LoginPage({ onLogin }) {
  const [page, setPage] = useState('login');
  const [regUser, setRegUser] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [pass, setPass] = useState('');
  const [err, setErr] = useState('');
  const [showPwd, setShowPwd] = useState(false);

  if (page === 'register') return <RegisterPage onBack={()=>setPage('login')} onSuccess={u=>{setRegUser(u);setPage('login');setErr('');}} />;
  if (page === 'forgot') return <ForgotPage onBack={()=>setPage('login')} />;

  function submit(e) {
    e.preventDefault(); setErr('');

    if (identifier === 'admin' && pass === getAdminPassword()) {
      onLogin('admin');
      return;
    }

    const users = getUsers();
    const found = users.find(u =>
      (u.username === identifier) ||
      (u.email && u.email.toLowerCase() === identifier.toLowerCase())
    );

    if (found && found.password === pass) {
      onLogin(found.username);
      return;
    }

    setErr('❌ Identifiants incorrects');
  }

  return (
    <div className="home-wrap">
      <div className="login-card">
        <div className="login-logo">👥</div>
        <h1>Gestion des Employés</h1>
        <p className="subtitle">Connectez-vous pour accéder à l'application</p>
        {regUser && <div className="alert alert-success">✅ Compte créé pour <b>{regUser}</b> !</div>}
        {err && <div className="alert alert-error">{err}</div>}
        <form onSubmit={submit}>
          <div className="form-group" style={{textAlign:'left'}}>
            <label>Nom d'utilisateur ou Email</label>
            <input
              value={identifier}
              onChange={e=>setIdentifier(e.target.value)}
              placeholder="Entrez votre nom ou email"
              required
            />
          </div>
          <div className="form-group" style={{textAlign:'left'}}>
            <label>Mot de passe</label>
            <div className="password-wrapper">
              <input type={showPwd?'text':'password'} value={pass} onChange={e=>setPass(e.target.value)} placeholder="Mot de passe" required />
              <button type="button" className="eye-btn" onClick={()=>setShowPwd(!showPwd)}>{showPwd?'🙈':'👁️'}</button>
            </div>
          </div>
          <div style={{textAlign:'right',marginBottom:20,marginTop:-8}}>
            <button type="button" className="btn-link" onClick={()=>setPage('forgot')}>🔑 Mot de passe oublié ?</button>
          </div>
          <button type="submit" className="btn btn-primary" style={{width:'100%',justifyContent:'center',padding:'14px',fontSize:'16px'}}>
            🔐 Se connecter
          </button>
          <div className="divider">pas encore de compte ?</div>
          <button type="button" className="btn-outline" style={{width:'100%',justifyContent:'center',padding:'11px'}} onClick={()=>{setPage('register');setErr('');setRegUser('');}}>
            📝 Créer un compte
          </button>
        </form>
      </div>
    </div>
  );
}

// ========== DASHBOARD ==========
function Dashboard({ currentUser, userEmail }) {
  const [nbEmployes, setNbEmployes] = useState(0);

  useEffect(() => {
    fetch(`${API}/bilan.php`)
      .then(r => r.json())
      .then(d => { if (d.nb) setNbEmployes(d.nb); })
      .catch(() => {});
  }, []);

  const menuItems = [
    { icon: '➕', title: 'Ajouter un employé', desc: 'Enregistrer un nouvel employé dans la base', link: '/ajout' },
    { icon: '📋', title: 'Liste & Modification', desc: 'Consulter, modifier ou supprimer des employés', link: '/liste' },
    { icon: '📊', title: 'Bilan & Graphiques', desc: 'Statistiques salariales, histogramme et camembert', link: '/bilan' },
  ];

  return (
    <>
      <div className="dashboard-header">
        <h1>Gestion des Employés</h1>
        <p>Système de gestion des ressources humaines — <strong>{nbEmployes}</strong> employé(s) enregistré(s)</p>
      </div>

      <div className="dashboard">
        {menuItems.map((item, index) => (
          <NavLink key={index} to={item.link} className="dashboard-card">
            <span className="dashboard-card-icon">{item.icon}</span>
            <div className="dashboard-card-title">{item.title}</div>
            <div className="dashboard-card-desc">{item.desc}</div>
            <span className="dashboard-card-badge">Accéder →</span>
          </NavLink>
        ))}
      </div>

      <div style={{marginTop:40, padding:'20px 24px', background:'#bf82118d', borderRadius:12, border:'1px solid var(--border-color)', textAlign:'center'}}>
        <p style={{fontSize:14, color:'#5c616a'}}>
          👋 Bienvenue dans l'application de gestion des employés. Utilisez les cartes ci-dessus ou le menu de gauche pour naviguer.
        </p>
      </div>
    </>
  );
}

// ========== MENU 1 : AJOUT (message auto-effacé) ==========
function AddEmployee() {
  const [nom, setNom] = useState('');
  const [salaire, setSalaire] = useState('');
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    setMsg(null);

    try {
      const res = await fetch(`${API}/add_employee.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nom, salaire: parseFloat(salaire) })
      });
      const data = await res.json();
      if (data.success) {
        setNom('');
        setSalaire('');
        setMsg({ t: 'success', m: `✅ Insertion réussie --- ID attribué : #${data.id}` });
      } else {
        setMsg({ t: 'error', m: `❌ ${data.message}` });
      }
    } catch {
      setMsg({ t: 'error', m: '❌ Serveur PHP inaccessible' });
    }
    setLoading(false);

    timerRef.current = setTimeout(() => {
      setMsg(null);
    }, 3000);
  }

  return (
    <div>
      <h2 className="page-title">➕ Ajouter un employé</h2>
      <div className="page-add-wrapper">
        <div className="page-add-overlay"></div>
        <div className="page-add-content">
          <div className="add-badge">🏢 Gestion des employés</div>
          <div className="card" style={{ maxWidth: 780, borderTop: '3px solid var(--primary)', margin: '0 auto' }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--primary-dark)', marginBottom: 20, paddingBottom: 12, borderBottom: '1px solid var(--border-color)' }}>
              📝 Informations de l'employé
            </h3>
            <form onSubmit={submit}>
              <div className="form-group">
                <label>Nom complet</label>
                <input value={nom} onChange={e => setNom(e.target.value)} placeholder="Ex: Alice Randria" required />
              </div>
              <div className="form-group">
                <label>Salaire (Ar)</label>
                <input type="number" min="0" step="0.01" value={salaire} onChange={e => setSalaire(e.target.value)} placeholder="Ex: 2500" required />
              </div>
              <div className="info-box">
                <b>Calcul automatique de obs :</b><br />
                Salaire &lt; 1 000 → <b>médiocre</b> &nbsp;|&nbsp;
                1 000 -- 5 000 → <b>moyen</b> &nbsp;|&nbsp;
                &gt; 5 000 → <b>grand</b>
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '15px' }} disabled={loading}>
                {loading ? '⏳ Enregistrement en cours...' : '💾 Enregistrer l\'employé'}
              </button>
            </form>
            {msg && (
              <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--border-color)' }}>
                <div className={`alert alert-${msg.t === 'success' ? 'success' : 'error'}`} style={{ marginBottom: 0 }}>
                  {msg.m}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ========== MENU 2 : LISTE (message auto-effacé) ==========
function ListEmployee() {
  const [employes, setEmployes] = useState([]);
  const [msg, setMsg] = useState(null);
  const [recherche, setRecherche] = useState('');
  const [editEmp, setEditEmp] = useState(null);
  const [editNom, setEditNom] = useState('');
  const [editSal, setEditSal] = useState('');
  const [saving, setSaving] = useState(false);
  const [confirmModal, setConfirmModal] = useState(null);
  const timerRef = useRef(null);

  // Définition de la fonction load avant son utilisation
  async function load() {
    try {
      const res = await fetch(`${API}/list_employees.php`);
      const data = await res.json();
      setEmployes(Array.isArray(data) ? data : []);
    } catch {
      setMsg({ t: 'error', m: '❌ Impossible de charger la liste' });
      timerRef.current = setTimeout(() => setMsg(null), 3000);
    }
  }

  useEffect(() => {
    load();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const employesFiltres = employes.filter(e =>
    e.nom.toLowerCase().includes(recherche.toLowerCase()) ||
    String(e.numEmp).includes(recherche)
  );

  function showMessage(type, text) {
    if (timerRef.current) clearTimeout(timerRef.current);
    setMsg({ t: type, m: text });
    timerRef.current = setTimeout(() => {
      setMsg(null);
    }, 3000);
  }

  async function handleDeleteConfirmed() {
    if (!confirmModal) return;
    const { numEmp, nom } = confirmModal;
    setConfirmModal(null);
    try {
      const res = await fetch(`${API}/update_employee.php`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ numEmp })
      });
      const data = await res.json();
      showMessage(data.success ? 'success' : 'error', data.success ? `✅ ${data.message}` : `❌ ${data.message}`);
      if (data.success) load();
    } catch {
      showMessage('error', '❌ Erreur réseau');
    }
  }

  function openConfirmModal(numEmp, nom) {
    setConfirmModal({ numEmp, nom });
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`${API}/update_employee.php`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ numEmp: editEmp.numEmp, nom: editNom, salaire: parseFloat(editSal) })
      });
      const data = await res.json();
      showMessage(data.success ? 'success' : 'error', data.success ? `✅ ${data.message}` : `❌ ${data.message}`);
      if (data.success) {
        setEditEmp(null);
        load();
      }
    } catch {
      showMessage('error', '❌ Erreur réseau');
    }
    setSaving(false);
  }

  const badgeClass = obs => obs === 'médiocre' ? 'mediocre' : obs === 'moyen' ? 'moyen' : 'grand';

  return (
    <div>
      <h2 className="page-title">📋 Liste des employés</h2>

      <div className="card" style={{ padding: '16px 20px', marginBottom: 16 }}>
        <input className="search-input" type="text" placeholder="🔍 Rechercher par nom ou numéro..." value={recherche} onChange={e => setRecherche(e.target.value)} />
        {recherche && <p style={{ marginTop: 10, fontSize: 13, color: 'var(--primary-dark)', fontWeight: 600 }}>🎯 {employesFiltres.length} résultat(s) trouvé(s)</p>}
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {employesFiltres.length === 0 ? (
          <p style={{ color: '#b91c1c', padding: 40, textAlign: 'center', fontWeight: 600 }}>Aucun employé trouvé.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>N°</th>
                  <th>Nom</th>
                  <th>Salaire (Ar)</th>
                  <th>Obs</th>
                  <th style={{ textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {employesFiltres.map((e, index)=> (
                  <tr key={e.numEmp}>
                    <td style={{ fontWeight: 700, color: 'var(--primary-dark)' }}>#{index + 1}</td>
                    <td style={{ fontWeight: 600, color: '#1a202c' }}>{e.nom}</td>
                    <td style={{ fontWeight: 600 }}>{parseFloat(e.salaire).toLocaleString('fr')} Ar</td>
                    <td>
                      <span className={`badge badge-${badgeClass(e.obs)}`}>
                        <span className="badge-dot"></span>
                        {e.obs}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons" style={{ justifyContent: 'center' }}>
                        <button
                          className="btn-pill btn-pill-warning"
                          onClick={() => { setEditEmp(e); setEditNom(e.nom); setEditSal(e.salaire); setMsg(null); }}
                        >
                          ✏️ Modifier
                        </button>
                        <button
                          className="btn-pill btn-pill-danger"
                          onClick={() => openConfirmModal(e.numEmp, e.nom)}
                        >
                          🗑️ Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {msg && (
          <div style={{ padding: '16px 20px', borderTop: '1px solid #f3f4f6' }}>
            <div className={`alert alert-${msg.t === 'success' ? 'success' : 'error'}`} style={{ marginBottom: 0 }}>
              {msg.m}
            </div>
          </div>
        )}
      </div>

      {confirmModal && (
        <div className="modal-overlay" onClick={() => setConfirmModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 400 }}>
            <div className="modal-confirm-icon">⚠️</div>
            <h2 style={{ textAlign: 'center', color: 'var(--primary-dark)' }}>Confirmer la suppression</h2>
            <p className="modal-confirm-message">
              Êtes-vous sûr de vouloir supprimer l'employé :
            </p>
            <p className="modal-confirm-name">« {confirmModal.nom} »</p>
            <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>
              Cette action est irréversible.
            </p>
            <div className="modal-confirm-actions">
              <button className="btn btn-gray" onClick={() => setConfirmModal(null)} style={{ padding: '10px 28px' }}>
                Annuler
              </button>
              <button className="btn btn-danger" onClick={handleDeleteConfirmed} style={{ padding: '10px 28px' }}>
                🗑️ Confirmer la suppression
              </button>
            </div>
          </div>
        </div>
      )}

      {editEmp && (
        <div className="modal-overlay" onClick={() => setEditEmp(null)}>
          <div className="modal" onClick={ev => ev.stopPropagation()}>
            <h2>✏️ Modifier employé #{editEmp.numEmp}</h2>
            <form onSubmit={handleSave}>
              <div className="form-group"><label>Nom</label><input value={editNom} onChange={e => setEditNom(e.target.value)} required autoFocus /></div>
              <div className="form-group"><label>Salaire (Ar)</label><input type="number" min="0" step="0.01" value={editSal} onChange={e => setEditSal(e.target.value)} required /></div>
              <div className="modal-actions">
                <button type="button" className="btn btn-gray" onClick={() => setEditEmp(null)}>Annuler</button>
                <button type="submit" className="btn btn-success" disabled={saving}>{saving ? '⏳...' : '💾 Enregistrer'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
// ========== MENU 3 : BILAN (avec boutons de bascule) ==========
function Bilan() {
  const [bilan, setBilan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [graphType, setGraphType] = useState('pie'); // 'pie' par défaut

  useEffect(()=>{
    fetch(`${API}/bilan.php`)
      .then(r=>r.json())
      .then(d=>{setBilan(d);setLoading(false);})
      .catch(()=>{setErr('❌ Impossible de charger le bilan');setLoading(false);});
  },[]);

  if (loading) return <p style={{color:'var(--text-muted)',padding:'20px 0'}}>⏳ Chargement...</p>;
  if (err) return <div className="alert alert-error">{err}</div>;
  if (!bilan||bilan.nb===0) return <div className="alert alert-error">Aucun employé. Ajoutez-en via Menu 1.</div>;

  const maxSal = Math.max(...bilan.employes.map(e=>parseFloat(e.salaire)));
  const getObs = s => parseFloat(s)<1000?'médiocre':parseFloat(s)<=5000?'moyen':'grand';
  const counts = bilan.employes.reduce((acc,e)=>{ acc[getObs(e.salaire)]++; return acc; }, { médiocre:0, moyen:0, grand:0 });
  const total = Object.values(counts).reduce((a,b)=>a+b,0);

  const pieSlices = () => {
    const colors={ médiocre:'#ef4444', moyen:'#f59e0b', grand:'#10b981' };
    const data = Object.entries(counts).filter(([,v])=>v>0).map(([k,v])=>({ label:k, value:v, color:colors[k] }));
    let cumul=0; const cx=120,cy=120,r=100;
    return data.map(d=>{
      const pct = d.value/total;
      const start = cumul*2*Math.PI - Math.PI/2; cumul += pct;
      const end = cumul*2*Math.PI - Math.PI/2;
      const x1 = cx + r*Math.cos(start), y1 = cy + r*Math.sin(start);
      const x2 = cx + r*Math.cos(end), y2 = cy + r*Math.sin(end);
      const large = pct>0.5?1:0;
      const mx = cx + (r*0.65)*Math.cos((start+end)/2);
      const my = cy + (r*0.65)*Math.sin((start+end)/2);
      return { ...d, path:`M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`, mx, my };
    });
  };

  return (
    <div>
      <h2 className="page-title">📊 Bilan salarial</h2>
      <div className="stat-grid">
        {[
          { label:'Salaire total', value:bilan.total.toLocaleString('fr')+' Ar', color:'#0f2440', icon:'💰' },
          { label:'Salaire minimal', value:bilan.minimal.toLocaleString('fr')+' Ar', color:'#b91c1c', icon:'📉' },
          { label:'Salaire maximal', value:bilan.maximal.toLocaleString('fr')+' Ar', color:'#0f2440', icon:'📈' },
          { label:'Nb employés', value:bilan.nb, color:'#78350F', icon:'👥' },
        ].map(s=>(
          <div key={s.label} className="stat-card">
            <div style={{fontSize:28,marginBottom:8}}>{s.icon}</div>
            <div className="stat-value" style={{color:s.color, fontWeight:800}}>{s.value}</div>
            <div className="stat-label" style={{color:'#2d3748', fontWeight:600}}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Boutons de bascule */}
      <div style={{display:'flex', gap:12, marginBottom:20}}>
        <button className={`btn ${graphType==='bar'?'btn-primary':'btn-gray'}`} onClick={()=>setGraphType('bar')}>📊 Histogramme</button>
        <button className={`btn ${graphType==='pie'?'btn-primary':'btn-gray'}`} onClick={()=>setGraphType('pie')}>🥧 Camembert</button>
      </div>

      {/* Graphique choisi */}
      <div className="card">
        {graphType==='bar' ? (
          <>
            <h3 style={{marginBottom:24,fontSize:16,fontWeight:700,color:'var(--primary-dark)'}}>📊 Histogramme --- Salaire par employé</h3>
            <div style={{display:'flex', gap:20, marginBottom:16, flexWrap:'wrap'}}>
              {[
                {label:'Médiocre (< 1 000)', color:'#ef4444'},
                {label:'Moyen (1 000 – 5 000)', color:'#f59e0b'},
                {label:'Grand (> 5 000)', color:'#10b981'},
              ].map(l=>(
                <div key={l.label} style={{display:'flex', alignItems:'center', gap:8}}>
                  <div style={{width:14, height:14, borderRadius:3, background:l.color}}/>
                  <span style={{fontSize:13, color:'#374151', fontWeight:600}}>{l.label}</span>
                </div>
              ))}
            </div>
            <svg width="100%" viewBox={`0 0 ${Math.max(400,bilan.employes.length*80+80)} 320`}>
              {bilan.employes.map((e,i)=>{
                const sal = parseFloat(e.salaire);
                const barH = (sal/maxSal)*200;
                const x = 60+i*80;
                const y = 240-barH;
                const col = sal<1000?'#ef4444':sal<=5000?'#f59e0b':'#10b981';
                const obs = sal<1000?'médiocre':sal<=5000?'moyen':'grand';
                return (
                  <g key={e.nom}>
                    <rect x={x} y={y} width={50} height={barH} fill={col} rx="6" opacity="0.9"/>
                    <rect x={x} y={y} width={50} height={8} fill={col} rx="6"/>
                    <text x={x+25} y={y-10} textAnchor="middle" fontSize="10" fill="#374151" fontWeight="700">{sal.toLocaleString('fr')}</text>
                    {barH > 30 && (
                      <text x={x+25} y={y+barH/2+5} textAnchor="middle" fontSize="10" fill="#fff" fontWeight="800">{obs}</text>
                    )}
                    <text x={x+25} y="268" textAnchor="middle" fontSize="11" fill="#374151" fontWeight="600">{e.nom.split(' ')[0]}</text>
                    {barH <= 30 && (
                      <text x={x+25} y="285" textAnchor="middle" fontSize="9" fill={col} fontWeight="800">{obs}</text>
                    )}
                  </g>
                );
              })}
              <line x1="55" y1="240" x2={60+bilan.employes.length*80} y2="240" stroke="var(--border-color)" strokeWidth="2"/>
            </svg>
          </>
        ) : (
          <>
            <h3 style={{marginBottom:24,fontSize:16,fontWeight:700,color:'var(--primary-dark)'}}>🥧 Camembert --- Répartition par obs</h3>
            <div style={{display:'flex',alignItems:'center',gap:48,flexWrap:'wrap'}}>
              <svg width="240" height="240" viewBox="0 0 240 240">
                {pieSlices().map(s=>(
                  <g key={s.label}>
                    <title>{s.label}</title>
                    <path d={s.path} fill={s.color} stroke="#fff" strokeWidth="3"/>
                    {s.value>0&&<text x={s.mx} y={s.my} textAnchor="middle" fontSize="14" fontWeight="800" fill="#fff">{Math.round(s.value/total*100)}%</text>}
                  </g>
                ))}
              </svg>
              <div style={{display:'flex',flexDirection:'column',gap:16}}>
                {Object.entries(counts).map(([k,v])=>(
                  <div key={k} style={{display:'flex',alignItems:'center',gap:12}}>
                    <div style={{width:16,height:16,borderRadius:'4px',background:k==='médiocre'?'#ef4444':k==='moyen'?'#f59e0b':'#10b981'}}/>
                    <div>
                      <span style={{fontSize:14,fontWeight:700,color:'#1a202c'}}>{k}</span>
                      <span style={{fontSize:13,color:'var(--text-muted)',marginLeft:8}}>{v} employé(s)</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
// ========== SIDEBAR (avec modale de confirmation de déconnexion) ==========
function Sidebar({ currentUser, userEmail, onLogout }) {
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleConfirmLogout = () => {
    setShowLogoutModal(false);
    onLogout();
  };

  const handleCancelLogout = () => {
    setShowLogoutModal(false);
  };

  return (
    <>
      <div className="sidebar">
        <div className="sidebar-brand">
          👥 Gestion<br /><span>Employés</span>
        </div>
        <nav className="sidebar-menu">
          <NavLink to="/" className={({ isActive }) => 'sidebar-link' + (isActive ? ' active' : '')}>
            <span className="icon">🏠</span> Accueil
          </NavLink>
          <NavLink to="/ajout" className={({ isActive }) => 'sidebar-link' + (isActive ? ' active' : '')}>
            <span className="icon">➕</span> Ajout
          </NavLink>
          <NavLink to="/liste" className={({ isActive }) => 'sidebar-link' + (isActive ? ' active' : '')}>
            <span className="icon">📋</span> Liste
          </NavLink>
          <NavLink to="/bilan" className={({ isActive }) => 'sidebar-link' + (isActive ? ' active' : '')}>
            <span className="icon">📊</span> Bilan
          </NavLink>
        </nav>
        <div className="sidebar-footer">
          <div className="sidebar-user">
            <span style={{ fontWeight: 700, color: '#ffffff' }}>👤 {currentUser}</span><br />
            <span style={{ fontSize: 11, color: '#e2e8f0' }}>{userEmail}</span>
          </div>
          <button className="sidebar-logout" onClick={handleLogoutClick} style={{ color: '#ffffff', fontWeight: 700 }}>
            <span className="icon">🚪</span> Déconnexion
          </button>
        </div>
      </div>

      {/* MODALE DE CONFIRMATION DE DÉCONNEXION */}
      {showLogoutModal && (
        <div className="modal-overlay" onClick={handleCancelLogout}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 400 }}>
            <div className="modal-confirm-icon">🔒</div>
            <h2 style={{ textAlign: 'center', color: 'var(--primary-dark)' }}>Confirmer la déconnexion</h2>
            <p style={{ textAlign: 'center', fontSize: 16, color: '#374151', marginBottom: 8 }}>
              Voulez-vous vous déconnecter ?
            </p>
            <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-muted)', marginBottom: 20 }}>
              Vous devrez vous reconnecter pour accéder à nouveau à l'application.
            </p>
            <div className="modal-confirm-actions">
              <button
                className="btn btn-gray"
                onClick={handleCancelLogout}
                style={{ padding: '10px 28px' }}
              >
                Annuler
              </button>
              <button
                className="btn btn-danger"
                onClick={handleConfirmLogout}
                style={{ padding: '10px 28px' }}
              >
                🚪 Confirmer la déconnexion
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ========== APP ==========
export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState('');
  const [userEmail, setUserEmail] = useState('');

  const handleLogin = (username) => {
    setLoggedIn(true);
    setCurrentUser(username);
    if (username === 'admin') {
      setUserEmail('admin@example.com');
    } else {
      const users = getUsers();
      const found = users.find(u => u.username === username);
      setUserEmail(found ? found.email : '');
    }
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setCurrentUser('');
    setUserEmail('');
  };

  return (
    <>
      <style>{css}</style>
      <BrowserRouter>
        {loggedIn ? (
          <>
            <Sidebar currentUser={currentUser} userEmail={userEmail} onLogout={handleLogout} />
            <main className="main">
              <Routes>
                <Route path="/" element={<Dashboard currentUser={currentUser} userEmail={userEmail} />} />
                <Route path="/ajout" element={<AddEmployee />} />
                <Route path="/liste" element={<ListEmployee />} />
                <Route path="/bilan" element={<Bilan />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </main>
          </>
        ) : (
          <main className="main" style={{marginLeft:0, maxWidth:'100%', display:'flex', justifyContent:'center', alignItems:'center', minHeight:'100vh'}}>
            <LoginPage onLogin={handleLogin} />
          </main>
        )}
      </BrowserRouter>
    </>
  );
}