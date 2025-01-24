import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import {
  ArrowDown,
  ArrowDownLeft,
  ArrowLeftRight,
  ArrowRight,
  ArrowUpRight,
  LoaderCircle,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { GetAccounts } from '@/api/Accounts';
import { getTransactions } from '@/api/Transaction';
import MainLayout from '@/components/templates/MainLayout.tsx';
import type { AccountType } from '@/schema/AccountsSchema';
import type { CombinedOperationType } from '@/schema/TransactionSchema';

import { Button } from '../atoms/Button';
import Card from '../atoms/Card';
import Input from '../atoms/Input';
import { CustomSelect } from '../atoms/Select';

const Transactions = () => {
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>(
    'all'
  );
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [accounts, setAccounts] = useState<AccountType[]>([]);
  const [transactions, setTransactions] = useState<CombinedOperationType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const transactionsRef = useRef<HTMLDivElement>(null);

  const removeDuplicates = (operations: CombinedOperationType[]) => {
    const seen = new Set();
    return operations.filter((operation) => {
      if (
        operation.type === 'transaction' ||
        operation.type === 'pending_transaction'
      ) {
        const identifier = `${operation.type}-${operation.sender}-${operation.receiver}-${operation.amount}-${operation.date}-${operation.type === 'pending_transaction' ? 'pending' : operation.state}`;
        if (seen.has(identifier)) {
          return false;
        }
        seen.add(identifier);
        return true;
      }

      return true;
    });
  };

  const generatePDF = async () => {
    if (!transactionsRef.current) {
      return;
    }

    // Capture de la div sous forme de canvas
    const canvas = await html2canvas(transactionsRef.current, {
      scale: 2, // Amélioration de la qualité
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'cm', 'a4'); // Portrait, centimètres, A4

    // Réduction de la largeur de l'image dans le PDF
    const maxPdfWidth = pdf.internal.pageSize.getWidth() * 1.8;
    const imgHeight = (canvas.height * maxPdfWidth) / canvas.width;

    // Centrer l'image dans le PDF
    const xOffset = (pdf.internal.pageSize.getWidth() - maxPdfWidth) / 2;

    pdf.addImage(imgData, 'PNG', xOffset, 0, maxPdfWidth, imgHeight);
    pdf.save('transactions.pdf');
  };

  const filterTransactions = () => {
    return transactions.filter((transaction) => {
      if (selectedAccount) {
        if (filterType === 'income') {
          if (
            transaction.type === 'transaction' ||
            transaction.type === 'pending_transaction' ||
            transaction.type === 'deposit'
          ) {
            if (
              transaction.type !== 'deposit' &&
              transaction.receiver !== selectedAccount
            ) {
              return false;
            }
          } else {
            return false;
          }
        } else if (filterType === 'expense') {
          if (
            transaction.type === 'transaction' ||
            transaction.type === 'pending_transaction'
          ) {
            if (transaction.sender !== selectedAccount) {
              return false;
            }
          } else {
            return false;
          }
        }
      } else {
        if (filterType === 'income') {
          if (
            transaction.type === 'transaction' ||
            transaction.type === 'pending_transaction' ||
            transaction.type === 'deposit'
          ) {
            if (transaction.type === 'deposit') {
              return true;
            }
            const receiverIsInAccounts = accounts.some(
              (account) => account.id === transaction.receiver
            );
            if (!receiverIsInAccounts) {
              return false;
            }
          } else {
            return false;
          }
        } else if (filterType === 'expense') {
          if (
            transaction.type === 'transaction' ||
            transaction.type === 'pending_transaction'
          ) {
            const senderIsInAccounts = accounts.some(
              (account) => account.id === transaction.sender
            );
            if (!senderIsInAccounts) {
              return false;
            }
          } else {
            return false;
          }
        }
      }

      const query = searchQuery.toLowerCase();
      const amountMatches = transaction.amount.toString().includes(searchQuery);
      const labelMatches =
        transaction.type === 'deposit'
          ? false
          : (transaction.label?.toLowerCase().includes(query) ?? false);

      return amountMatches || labelMatches;
    });
  };

  useEffect(() => {
    const fetchAccountsAndTransactions = async () => {
      try {
        const fetchedAccounts = await GetAccounts();
        setAccounts(fetchedAccounts);

        const allTransactions = await Promise.all(
          fetchedAccounts.map((account) =>
            getTransactions({ accountId: account.id })
          )
        );

        const flattenedTransactions = allTransactions.flat();
        const uniqueTransactions = removeDuplicates(flattenedTransactions);

        setTransactions(uniqueTransactions);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    void fetchAccountsAndTransactions();
  }, []);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (selectedAccount && selectedAccount !== 'all') {
        try {
          const allTransactions = await getTransactions({
            accountId: selectedAccount,
          });
          setTransactions(allTransactions.flat());
        } catch (error) {
          console.error(error);
          setTransactions([]);
        }
      } else {
        try {
          const fetchedAccounts = await GetAccounts();
          setAccounts(fetchedAccounts);

          const allTransactions = await Promise.all(
            fetchedAccounts.map((account) =>
              getTransactions({ accountId: account.id })
            )
          );

          const flattenedTransactions = allTransactions.flat();
          const uniqueTransactions = removeDuplicates(flattenedTransactions);

          setTransactions(uniqueTransactions);
        } catch (error) {
          console.error(error);
        }
      }
    };

    void fetchTransactions();
  }, [selectedAccount]);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex h-screen items-center justify-center">
          <p className="text-xl text-gray-500">Loading data...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="p-4">
        <div className="mb-4 flex flex-col gap-4">
          <CustomSelect
            className="rounded border p-2"
            label="Sélectionner un compte"
            placeholder="Tous les comptes"
            value={selectedAccount || 'all'}
            onChange={(value) =>
              setSelectedAccount(value === 'all' ? null : value)
            }
            options={[
              { value: 'all', label: 'Tous les comptes' },
              ...accounts.map((account) => ({
                value: account.id,
                label: account.name,
              })),
            ]}
          />

          {/* Filtrage par type */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              className={`${filterType === 'all' ? 'bg-blue-500 text-white' : ''}`}
              onClick={() => setFilterType('all')}
            >
              Toutes
            </Button>
            <Button
              variant="outline"
              className={`${filterType === 'income' ? 'bg-green-500 text-white' : ''}`}
              onClick={() => setFilterType('income')}
            >
              Recettes
            </Button>
            <Button
              variant="outline"
              className={`${filterType === 'expense' ? 'bg-red-500 text-white' : ''}`}
              onClick={() => setFilterType('expense')}
            >
              Dépenses
            </Button>
          </div>

          <div className="mb-4 flex justify-end">
            <Button variant="outline" onClick={generatePDF}>
              Télécharger PDF
            </Button>
          </div>

          {/* Champ de recherche */}
          <Input
            id="chercher"
            label="chercher une transaction"
            type="text"
            placeholder="Rechercher par montant ou libellé"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div ref={transactionsRef} className="flex flex-col items-center">
          <ul className="space-y-4">
            <h1 className="mb-4 w-full text-start text-2xl font-semibold">
              Transactions
            </h1>
            {filterTransactions().map((transaction, index) => {
              if (
                transaction.type === 'transaction' ||
                transaction.type === 'pending_transaction'
              ) {
                const senderIsInAccounts = accounts.some(
                  (account) => account.id === transaction.sender
                );
                const receiverIsInAccounts = accounts.some(
                  (account) => account.id === transaction.receiver
                );

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
        </div>
      </div>
    </MainLayout>
  );
};

export default Transactions;
