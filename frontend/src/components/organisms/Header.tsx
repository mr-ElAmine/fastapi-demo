import {
  ArrowRightLeft,
  ChartNoAxesColumn,
  CircleUserRound,
  CreditCard,
  Landmark,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export function Header() {
  const navLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: <ChartNoAxesColumn /> },
    { to: '/transactions', label: 'Transactions', icon: <ArrowRightLeft /> },
    { to: '/accounts', label: 'My Accounts', icon: <CreditCard /> },
    { to: '/transfers', label: 'Transfers', icon: <Landmark /> },
  ];

  return (
    <aside className="flex h-screen w-64 flex-col bg-gray-800 text-white">
      {/* Logo / Titre */}
      <div className="bg-gray-900 p-4 text-2xl font-bold">Banck app</div>

      {/* Liens de navigation générés avec map */}
      <nav className="flex-1 p-4">
        <ul className="space-y-4">
          {navLinks.map((link, index) => (
            <li key={index}>
              <Link
                to={link.to}
                className="flex items-center gap-2 rounded p-2 hover:bg-gray-700"
              >
                <div className="flex items-center justify-center gap-4">
                  <div>{link.icon}</div>

                  {link.label}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="border-t border-gray-700 p-4">
        <Link
          to="/profil"
          className="flex items-center gap-2 rounded p-2 hover:bg-gray-700"
        >
          <div className="flex items-center justify-center gap-4">
            <div>
              <CircleUserRound />
            </div>
            Profil
          </div>
        </Link>
      </div>
    </aside>
  );
}
