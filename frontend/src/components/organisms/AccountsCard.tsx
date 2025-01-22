import { MoreHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';

import Card from '../atoms/Card';

const AccountsCard = () => {
  const accounts = [
    {
      title: 'Compte courant',
      balance: '1234,56€',
      iban: 'FR76 1234 4321 0987...',
    },
    {
      title: 'Compte épargne',
      balance: '567,89€',
      iban: 'FR76 8765 4321 1234...',
    },
    {
      title: 'Compte épargne',
      balance: '567,89€',
      iban: 'FR76 8765 4321 1234...',
    },
    {
      title: 'Compte épargne',
      balance: '567,89€',
      iban: 'FR76 8765 4321 1234...',
    },
    {
      title: 'Compte épargne',
      balance: '567,89€',
      iban: 'FR76 8765 4321 1234...',
    },
    {
      title: 'Compte épargne',
      balance: '567,89€',
      iban: 'FR76 8765 4321 1234...',
    },
    {
      title: 'Compte épargne',
      balance: '567,89€',
      iban: 'FR76 8765 4321 1234...',
    },
    {
      title: 'Compte épargne',
      balance: '567,89€',
      iban: 'FR76 8765 4321 1234...',
    },
    {
      title: 'Compte épargne',
      balance: '567,89€',
      iban: 'FR76 8765 4321 1234...',
    },
  ];

  const handleCardClick = () => {
    console.log('Card Clicked');
  };

  const handleParamClick = (event) => {
    event.preventDefault();
    alert('Params clicked!');
  };

  return (
    <div className="flex flex-wrap gap-4">
      {accounts.map((account, index) => (
        <div className="w-1/3" key={index}>
          <Link to="/transactions" onClick={handleCardClick} className="w-full">
            <Card>
              <div className="relative mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold">{account.title}</h3>
                <button
                  onClick={handleParamClick}
                  className="absolute right-0 top-0"
                >
                  <MoreHorizontal />
                </button>
              </div>
              <div className="mb-4 flex items-center justify-between text-2xl font-bold">
                <span>{account.balance}</span>
                <span className="text-sm text-gray-500">{account.iban}</span>
              </div>
            </Card>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default AccountsCard;
