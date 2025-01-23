import {
  ArrowRightLeft,
  ChartNoAxesColumn,
  CircleUserRound,
  CreditCard,
  Landmark,
  LogOut,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

import useAuth from '@/hooks/use-auth';

import { Button } from '../atoms/Button';

export function Header() {
  const { setToken } = useAuth();
  const navigate = useNavigate();

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: <ChartNoAxesColumn /> },
    { to: '/transactions', label: 'Transactions', icon: <ArrowRightLeft /> },
    { to: '/accounts', label: 'My Accounts', icon: <CreditCard /> },
    { to: '/transfers', label: 'Transfers', icon: <Landmark /> },
  ];

  const handleLogout = async () => {
    setToken(null);
    await navigate('/', { replace: true });
  };

  return (
    <aside className="flex h-screen w-80 flex-col border-e-4 border-black bg-white text-gray-800 shadow-lg">
      {/* Titre / Logo */}
      <div className="bg-gray-100 p-4 text-2xl font-bold">Bankulin</div>

      {/* Liens de navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-4">
          {navLinks.map((link, index) => (
            <li key={index}>
              <Link
                to={link.to}
                className="flex items-center gap-2 rounded p-2 hover:bg-gray-200"
              >
                <div className="flex items-center justify-center gap-4">
                  <div className="text-gray-600">{link.icon}</div>
                  {link.label}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Pied de page */}
      <div className="border-t-2 border-black p-4">
        <div className="flex items-center justify-between gap-2 rounded p-2 hover:bg-gray-200">
          <Link to="/profile" className="flex w-full justify-start">
            <div className="flex items-center justify-center gap-4">
              <div>
                <CircleUserRound />
              </div>
              Profile
            </div>
          </Link>
          <Button
            size="icon"
            className="z-50 border-2 border-black bg-red-500"
            onClick={handleLogout}
          >
            <LogOut className="text-white" />
          </Button>
        </div>
      </div>
    </aside>
  );
}
