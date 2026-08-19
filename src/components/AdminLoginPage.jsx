import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { getAdminAuthorization } from '../lib/admin';
import '../admin-login.css';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState(params.get('reason') === 'unauthorized' ? 'This account is not authorised to access the studio dashboard.' : '');
  const [busy, setBusy] = useState(false);

  useEffect(() => { getAdminAuthorization().then(({ isAdmin }) => { if (isAdmin) navigate('/admin', { replace: true }); }); }, [navigate]);

  async function login(event) {
    event.preventDefault();
    if (!supabase) return setMessage('Supabase is not configured yet. Please add the project environment values.');
    setBusy(true); setMessage('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setBusy(false); return setMessage('Unable to sign in. Please check your email and password.'); }
    const { isAdmin } = await getAdminAuthorization();
    setBusy(false);
    if (!isAdmin) { await supabase.auth.signOut(); return setMessage('This account is not authorised to access the studio dashboard.'); }
    navigate('/admin', { replace: true });
  }

  return <main className="admin-login"><form className="login-card" onSubmit={login}>
    <Link className="login-logo" to="/"><img src="/logo.png" alt="Green Hill Studio"/> GREEN HILL STUDIO</Link>
    <p className="eyebrow">PRIVATE STUDIO ACCESS</p><h1>Admin Login</h1><p>Sign in to manage the studio gallery.</p>
    <label>Email<input type="email" required autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)} /></label>
    <label>Password<span className="password-field"><input type={showPassword ? 'text' : 'password'} required autoComplete="current-password" value={password} onChange={e=>setPassword(e.target.value)} /><button type="button" onClick={()=>setShowPassword(!showPassword)}>{showPassword ? 'Hide' : 'Show'}</button></span></label>
    {message && <p className="error">{message}</p>}<button className="button" disabled={busy}>{busy ? 'Signing in…' : 'Login securely'}</button>
    <Link className="return-home" to="/">← Return to website</Link>
  </form></main>;
}
