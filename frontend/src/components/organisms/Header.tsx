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
    <aside className="flex h-screen w-80 flex-col border-e-4 bg-white text-gray-800 shadow-lg">
      {/* Titre / Logo */}
      <div className="bg-gray-100 p-4 text-2xl font-bold">Banck App</div>

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
      <div className="border-t-2 border-gray-200 p-4">
        <Link
<<<<<<< HEAD
          to="/profile"
          className="flex items-center gap-2 rounded p-2 hover:bg-gray-700"
=======
          to="/profil"
          className="flex items-center gap-2 rounded p-2 hover:bg-gray-200"
>>>>>>> 91beef0d4d3953d602c129d65a78869de23d7723
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
