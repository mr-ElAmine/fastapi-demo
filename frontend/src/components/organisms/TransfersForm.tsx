import { Formik, Field, Form, ErrorMessage } from 'formik';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { useState } from 'react';

import Card from '../atoms/Card';

const TransfersForm = () => {
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

  const recipients = [
    {
      name: 'Voiture',
      iban: 'FR76 1234 4321 0987...',
    },
    {
      name: 'Compte épargne',
      iban: 'FR76 8765 4321 1234...',
    },
    {
      name: 'Compte épargne',
      iban: 'FR76 8765 4321 1234...',
    },
  ];

  const [selectedAccount, setSelectedAccount] = useState(accounts[0]);
  const [selectedRecipient, setSelectedRecipient] = useState(recipients[0]);
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const [isRecipientDropdownOpen, setIsRecipientDropdownOpen] = useState(false);

  const toggleAccountDropdown = () => {
    setIsAccountDropdownOpen((prev) => !prev);
  };

  const toggleRecipientDropdown = () => {
    setIsRecipientDropdownOpen((prev) => !prev);
  };

  const handleAccountSelect = (account) => {
    setSelectedAccount(account);
    setIsAccountDropdownOpen(false);
  };

  const handleRecipientSelect = (recipient) => {
    setSelectedRecipient(recipient);
    setIsRecipientDropdownOpen(false);
  };

  const handleSubmit = (values) => {
    console.log('Form submitted with values:', values);
  };

  return (
    <div className="mx-auto w-full max-w-4xl">
      <Formik
        initialValues={{
          amount: '',
          label: '',
        }}
        onSubmit={handleSubmit}
      >
        {() => (
          <Form className="space-y-6">
            <div className="flex items-stretch space-x-4">
              {/* Compte sélectionné */}
              <div className="relative w-1/2">
                <div
                  onClick={toggleAccountDropdown}
                  className="h-full cursor-pointer rounded-md border border-gray-300 shadow-md"
                >
                  <Card className="h-full">
                    <div className="flex h-full flex-col justify-between">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">
                          {selectedAccount.title}
                        </h3>
                        <ChevronDown className="h-5 w-5" />
                      </div>
                      <div className="mt-2">
                        <span className="text-sm text-gray-500">
                          {selectedAccount.iban}
                        </span>
                        <span className="block text-2xl font-bold">
                          {selectedAccount.balance}
                        </span>
                      </div>
                    </div>
                  </Card>
                </div>
                {isAccountDropdownOpen && (
                  <div className="absolute z-20 mt-2 w-full rounded-md border border-gray-300 bg-white shadow-lg">
                    {accounts.map((account, index) => (
                      <div
                        key={index}
                        onClick={() => handleAccountSelect(account)}
                        className="cursor-pointer p-4 hover:bg-gray-100"
                      >
                        <Card>
                          <h3 className="text-lg font-semibold">
                            {account.title}
                          </h3>
                          <div className="mt-2">
                            <span className="text-sm text-gray-500">
                              {account.iban}
                            </span>
                            <span className="block text-2xl font-bold">
                              {account.balance}
                            </span>
                          </div>
                        </Card>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center">
                <ArrowRight className="h-6 w-6 text-gray-500" />
              </div>

              <div className="relative w-1/2">
                <div
                  onClick={toggleRecipientDropdown}
                  className="h-full cursor-pointer rounded-md border border-gray-300 shadow-md"
                >
                  <Card>
                    <div className="flex h-full flex-col justify-between">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">
                          {selectedRecipient.name}
                        </h3>
                        <ChevronDown className="h-5 w-5" />
                      </div>
                      <span className="mt-2 block text-sm text-gray-500">
                        {selectedRecipient.iban}
                      </span>
                    </div>
                  </Card>
                </div>
                {isRecipientDropdownOpen && (
                  <div className="absolute z-20 mt-2 w-full rounded-md border border-gray-300 bg-white shadow-lg">
                    {recipients.map((recipient, index) => (
                      <div
                        key={index}
                        onClick={() => handleRecipientSelect(recipient)}
                        className="cursor-pointer p-4 hover:bg-gray-100"
                      >
                        <Card>
                          <h3 className="text-lg font-semibold">
                            {recipient.name}
                          </h3>
                          <span className="mt-2 block text-sm text-gray-500">
                            {recipient.iban}
                          </span>
                        </Card>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="mb-4">
              <Field
                type="number"
                id="amount"
                name="amount"
                placeholder="Montant"
                className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-blue-500"
              />
              <ErrorMessage
                name="amount"
                component="div"
                className="mt-1 text-sm text-red-600"
              />
            </div>
            <div className="mb-4">
              <Field
                type="text"
                id="label"
                name="label"
                placeholder="Libellé (facultatif)"
                className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-md bg-blue-600 py-2 text-white hover:bg-blue-700"
            >
              Confirmer
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default TransfersForm;
