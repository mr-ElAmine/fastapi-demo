import {
  ArrowDown,
  ArrowDownLeft,
  ArrowLeftRight,
  ArrowRight,
  ArrowUpRight,
  LoaderCircle,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { GetAccounts } from '@/api/Accounts'; // Assurez-vous que cette fonction est correctement importée
import { getTransactions } from '@/api/Transaction';
import type { CombinedOperationType } from '@/schema/TransactionSchema';

import Card from '../atoms/Card';
import MainLayout from '../templates/MainLayout';

export const AccountsTransactions = () => {
  const { uuid } = useParams(); // Récupère l'UUID depuis l'URL
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null); // Compte sélectionné
  const [transactions, setTransactions] = useState<CombinedOperationType[]>([]);
  const [loading, setLoading] = useState(true); // État de chargement

  useEffect(() => {
    const fetchAndSelectAccount = async () => {
      try {
        // Récupère tous les comptes
        const fetchedAccounts = await GetAccounts();

        // Vérifie si l'UUID correspond à l'un des comptes
        if (uuid) {
          const matchingAccount = fetchedAccounts.find(
            (account) => account.uuid === uuid
          );

          // Si un compte correspondant est trouvé, le sélectionne et récupère ses transactions
          if (matchingAccount) {
            setSelectedAccount(matchingAccount.id);

            try {
              const allTransactions = await getTransactions({
                accountId: matchingAccount.id,
              });
              setTransactions(allTransactions.flat());
            } catch (error) {
              console.error(
                'Erreur lors de la récupération des transactions:',
                error
              );
              setTransactions([]); // Vide les transactions en cas d'erreur
            }
          } else {
            console.warn(`Aucun compte trouvé pour l'UUID: ${uuid}`);
          }
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des comptes:', error);
      } finally {
        setLoading(false); // Désactive le chargement
      }
    };

    // Appelle la fonction pour récupérer les comptes et vérifier l'UUID
    void fetchAndSelectAccount();
  }, [uuid]);

  // Affiche un indicateur de chargement si les données sont en cours de récupération
  if (loading) {
    return (
      <MainLayout>
        <div className="flex h-screen items-center justify-center">
          <p className="text-xl text-gray-500">Chargement...</p>
        </div>
      </MainLayout>
    );
  }

  // Affiche un message si aucun compte n'est sélectionné
  if (!selectedAccount) {
    return (
      <MainLayout>
        <div className="p-4">
          <h1 className="text-2xl font-semibold">Aucun compte sélectionné</h1>
        </div>
      </MainLayout>
    );
  }

  // Affiche les transactions pour le compte sélectionné
  return (
    <MainLayout>
      <div className="p-4">
        <h1 className="mb-4 text-2xl font-semibold">
          Compte sélectionné : {selectedAccount}
        </h1>

        <h2 className="mb-4 text-xl font-semibold">Transactions :</h2>
        {transactions.length > 0 ? (
          <ul className="space-y-4">
            {transactions.map((transaction, index) => {
              if (
                transaction.type === 'transaction' ||
                transaction.type === 'pending_transaction'
              ) {
                const senderIsInAccounts =
                  selectedAccount === transaction.sender;
                const receiverIsInAccounts =
                  selectedAccount === transaction.receiver;

                return (
                  <Card key={index}>
                    <div className="flex flex-row items-center gap-4">
                      <div className="rounded-full bg-blue-100 p-2">
                        {transaction.type === 'pending_transaction' ? (
                          <div>
                            <LoaderCircle className="animate-spin text-blue-500" />
                          </div>
                        ) : (
                          <div>
                            {senderIsInAccounts && receiverIsInAccounts && (
                              <ArrowLeftRight className="text-blue-500" />
                            )}
                            {!senderIsInAccounts && receiverIsInAccounts && (
                              <ArrowDownLeft className="text-blue-500" />
                            )}
                            {senderIsInAccounts && !receiverIsInAccounts && (
                              <ArrowUpRight className="text-blue-500" />
                            )}
                          </div>
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="mb-2">
                          <div className="flex justify-between">
                            <div className="text-sm font-semibold text-gray-600">
                              {transaction.type}
                            </div>
                            <div className="text-md font-extrabold">
                              {transaction.type === 'pending_transaction'
                                ? 'pending'
                                : transaction.state}
                            </div>
                          </div>

                          <div className="flex items-center text-sm text-gray-700">
                            <div className="flex flex-col">
                              {transaction.sender}
                              {senderIsInAccounts && (
                                <span className="text-green-500">
                                  (Mon Compte)
                                </span>
                              )}
                            </div>
                            <ArrowRight className="mx-2 text-gray-500" />
                            <div className="flex flex-col">
                              {transaction.receiver}
                              {receiverIsInAccounts && (
                                <span className="text-blue-500">
                                  (Mon Compte)
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="text-sm text-gray-500">
                          {transaction.label || 'N/A'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(transaction.date).toLocaleDateString()}
                        </div>
                      </div>

                      <div className="text-end text-sm font-semibold">
                        {senderIsInAccounts && receiverIsInAccounts && (
                          <span className="text-gray-500">
                            {transaction.amount.toFixed(2)} €
                          </span>
                        )}
                        {senderIsInAccounts && !receiverIsInAccounts && (
                          <span className="text-red-500">
                            - {transaction.amount.toFixed(2)} €
                          </span>
                        )}
                        {!senderIsInAccounts && receiverIsInAccounts && (
                          <span className="text-green-500">
                            + {transaction.amount.toFixed(2)} €
                          </span>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              } else if (transaction.type === 'deposit') {
                return (
                  <Card key={index}>
                    <div className="flex flex-row items-center gap-4">
                      <div className="rounded-full bg-purple-100 p-2">
                        <ArrowDown className="text-purple-500" />
                      </div>
                      <div className="flex-1">
                        <div className="mb-2">
                          <div className="text-sm font-semibold text-gray-600">
                            Dépôt
                          </div>
                          <div className="text-sm text-gray-700">
                            {new Date(transaction.date).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="text-end text-sm font-semibold text-green-500">
                        + {transaction.amount.toFixed(2)} €
                      </div>
                    </div>
                  </Card>
                );
              } else {
                return null; // Gérer les autres types
              }
            })}
          </ul>
        ) : (
          <p className="text-gray-500">Aucune transaction trouvée.</p>
        )}
      </div>
    </MainLayout>
  );
};
