import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

import Card from '../atoms/Card';

const Transfers = () => {
  const accounts = [
    {
      title: 'Compte courant',
      balance: '1234,56€',
      iban: 'FR76 1234 4321 0987...',
    },
  ];
  return (
    <div>
      {accounts.map((account, index) => (
        <div className="w-1/3" key={index}>
          <Link to="/transactions" className="w-full p-4">
            <Card>
              <div className="relative mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold">{account.title}</h3>
                <ArrowRight />
              </div>
              <div className="mb-4 flex items-center justify-between text-2xl font-bold">
                <span className="text-sm text-gray-500">{account.iban}</span>
              </div>
            </Card>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default Transfers;
