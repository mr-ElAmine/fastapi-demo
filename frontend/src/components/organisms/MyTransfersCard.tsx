import { ArrowRight, ChevronDown } from 'lucide-react';
import { useState } from 'react';

import Card from '../atoms/Card';

const MyTransfers = () => {
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
  ];

  const [selectedItem, setSelectedItem] = useState(accounts[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleSelect = (account) => {
    setSelectedItem(account);
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  return (
    <div className="w-1/3">
      <div className="relative mb-6">
        <div
          onClick={toggleDropdown}
          className="w-full cursor-pointer rounded-md border border-gray-300 shadow-md"
        >
          <Card>
            <div className="relative mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">{selectedItem.title}</h3>
              <ChevronDown className="h-5 w-5" />
            </div>
            <div className="mb-4 flex flex-col">
              <span className="text-sm text-gray-500">{selectedItem.iban}</span>
              <span className="text-2xl font-bold">{selectedItem.balance}</span>
            </div>
          </Card>
        </div>

        {isDropdownOpen && (
          <div className="absolute z-20 mt-2 max-h-[300px] w-full overflow-y-auto rounded-md border border-gray-300 bg-white shadow-lg">
            {accounts.map((account, index) => (
              <div
                key={index}
                onClick={() => handleSelect(account)}
                className="cursor-pointer p-4 hover:bg-gray-100"
              >
                <Card>
                  <div className="relative mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-semibold">{account.title}</h3>
                    <ArrowRight />
                  </div>
                  <div className="mb-4 flex flex-col">
                    <span className="text-sm text-gray-500">
                      {account.iban}
                    </span>
                    <span className="text-2xl font-bold">
                      {account.balance}
                    </span>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTransfers;
