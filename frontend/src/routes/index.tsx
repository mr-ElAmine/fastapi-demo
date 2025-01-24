import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import Accounts from '@/components/pages/Accounts';
import { AccountsTransactions } from '@/components/pages/AccountsTransactions';
import Home from '@/components/pages/Home';
import Login from '@/components/pages/Login';
import NotFound from '@/components/pages/NotFound';
import Profile from '@/components/pages/Profile';
import Register from '@/components/pages/Register';
import Transactions from '@/components/pages/Transactions';
import TransfersMoney from '@/components/pages/TransfersMoney';
import Transfers from '@/components/pages/Virements';

import { ProtectedRoute } from './protected-route';

const RoutesApp = () => {
  // Routes publiques accessibles à tous
  const routesForPublic = [
    {
      path: '*',
      element: <NotFound />, // Page 404
    },
  ];

  // Routes accessibles uniquement aux utilisateurs authentifiés
  const routesForAuthenticatedOnly = [
    {
      path: '/',
      element: <ProtectedRoute />, // Protège les sous-routes
      children: [
        {
          path: '/',
          element: <Home />,
        },
        {
          path: '/accounts',
          element: <Accounts />,
        },
        {
          path: '/transfers',
          element: <Transfers />,
        },
        {
          path: '/transfers-money',
          element: <TransfersMoney />,
        },
        {
          path: '/transactions',
          element: <Transactions />,
        },
        {
          path: '/accounts/:uuid',
          element: <AccountsTransactions />,
        },
        {
          path: '/profile',
          element: <Profile />,
        },
      ],
    },
  ];

  // Routes accessibles uniquement aux utilisateurs non-authentifiés
  const routesForNotAuthenticatedOnly = [
    {
      path: '/login',
      element: <Login />,
    },
    {
      path: '/register',
      element: <Register />,
    },
  ];

  // Combinaison conditionnelle des routes en fonction du statut d'authentification
  const router = createBrowserRouter([
    ...routesForPublic,
    ...routesForNotAuthenticatedOnly,
    ...routesForAuthenticatedOnly,
  ]);

  // Fournit la configuration du routeur via RouterProvider
  return <RouterProvider router={router} />;
};

export default RoutesApp;
