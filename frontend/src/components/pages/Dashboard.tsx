import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
} from 'chart.js';
import type { Chart as ChartJSInstance, ChartOptions } from 'chart.js';
import { useEffect, useRef, useState } from 'react';
import { Line } from 'react-chartjs-2';

import MainLayout from '@/components/templates/MainLayout';

// Enregistrement des composants nécessaires dans Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  // Référence pour stocker les instances de graphiques
  const chartInstancesRef = useRef<ChartJSInstance[]>([]);
  const [loading, setLoading] = useState(true);

  // Simuler un chargement (peut être remplacé par un appel API réel)
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000); // Simule un délai de 1 seconde
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Nettoyer les instances de graphiques à la destruction du composant
    return () => {
      chartInstancesRef.current.forEach((chart) => chart.destroy());
      chartInstancesRef.current = [];
    };
  }, []);

  // Données pour les graphiques
  const soldeData = [
    { mois: 'Janvier', solde: 1000 },
    { mois: 'Février', solde: 1100 },
    { mois: 'Mars', solde: 1200 },
    { mois: 'Avril', solde: 1300 },
    { mois: 'Mai', solde: 1500 },
  ];

  const recettesData = [
    { mois: 'Janvier', recette: 500 },
    { mois: 'Février', recette: 600 },
    { mois: 'Mars', recette: 700 },
    { mois: 'Avril', recette: 800 },
    { mois: 'Mai', recette: 900 },
  ];

  const depensesData = [
    { mois: 'Janvier', depense: 200 },
    { mois: 'Février', depense: 300 },
    { mois: 'Mars', depense: 400 },
    { mois: 'Avril', depense: 500 },
    { mois: 'Mai', depense: 600 },
  ];

  // Options des graphiques avec les types attendus
  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' }, // Type sécurisé avec Chart.js
      tooltip: { enabled: true },
    },
    scales: {
      x: { title: { display: true, text: 'Mois' } },
      y: { title: { display: true, text: 'Montant (€)' } },
    },
  };

  // Données pour chaque graphique
  const soldeTotalData = {
    labels: soldeData.map((item) => item.mois),
    datasets: [
      {
        label: 'Solde Total',
        data: soldeData.map((item) => item.solde),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
      },
    ],
  };

  const recettesDataChart = {
    labels: recettesData.map((item) => item.mois),
    datasets: [
      {
        label: 'Recettes',
        data: recettesData.map((item) => item.recette),
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        fill: true,
      },
    ],
  };

  const fluxTresorerieData = {
    labels: depensesData.map((item) => item.mois),
    datasets: [
      {
        label: 'Recettes',
        data: recettesData.map((item) => item.recette),
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        fill: false,
      },
      {
        label: 'Dépenses',
        data: depensesData.map((item) => item.depense),
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: false,
      },
      {
        label: 'Solde',
        data: soldeData.map((item) => item.solde),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: false,
      },
    ],
  };

  // Affichage d'un écran de chargement
  if (loading) {
    return (
      <MainLayout>
        <div className="flex h-screen items-center justify-center">
          <p className="text-lg font-bold">Chargement des données...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="p-4">
        <h1 className="mb-6 text-2xl font-bold">Dashboard des Statistiques</h1>

        <div className="mb-10">
          <h2 className="mb-4 text-lg font-bold">Évolution du Solde Total</h2>
          <div className="mx-auto w-full max-w-3xl">
            <Line data={soldeTotalData} options={chartOptions} />
          </div>
        </div>

        <div className="mb-10">
          <h2 className="mb-4 text-lg font-bold">Évolution des Recettes</h2>
          <div className="mx-auto w-full max-w-3xl">
            <Line data={recettesDataChart} options={chartOptions} />
          </div>
        </div>

        <div>
          <h2 className="mb-4 text-lg font-bold">
            Flux de Trésorerie (Recettes, Dépenses et Solde)
          </h2>
          <div className="mx-auto w-full max-w-3xl">
            <Line data={fluxTresorerieData} options={chartOptions} />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
