import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import Accounts from '@/components/pages/Accounts';
import Home from '@/components/pages/Home';
import Login from '@/components/pages/Login';
import NotFound from '@/components/pages/NotFound';
import Profile from '@/components/pages/Profile';
import Register from '@/components/pages/Register';
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
          element: <Home />, // Page d'accueil utilisateur
        },
        {
          path: '/accounts',
          element: <Accounts />, // Comptes
        },
        {
          path: '/transfers',
          element: <Transfers />, // Virements
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
