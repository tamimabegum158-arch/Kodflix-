import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Header.css';

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/login', { replace: true });
  }

  return (
    <header className="kodflix-header">
      <Link to="/dashboard" className="kodflix-logo">Kodflix</Link>
      {user && (
        <div className="kodflix-header-user">
          <span className="kodflix-header-username">{user.username}</span>
          <button type="button" className="kodflix-header-logout" onClick={handleLogout}>
            Log out
          </button>
        </div>
      )}
    </header>
  );
}
