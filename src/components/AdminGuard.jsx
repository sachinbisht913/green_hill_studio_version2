import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { getAdminAuthorization } from '../lib/admin';

export default function AdminGuard({ children }) {
  const [state, setState] = useState(null);
  useEffect(() => { getAdminAuthorization().then(setState); }, []);
  if (!state) return <main className="admin-page">Checking secure admin access…</main>;
  if (!state.isAdmin) return <Navigate to="/admin/login?reason=unauthorized" replace />;
  return children;
}
