import { useEffect, useState } from 'react';

import { GetAccounts } from '@/api/Accounts';
import MainLayout from '@/components/templates/MainLayout.tsx';
import type { AccountType } from '@/schema/AccountsSchema';

import { DialogAddAccounts } from '../molecules/DialogAddAccounts';
import AccountsCard from '../organisms/AccountsCard';

const Accounts = () => {
  const [accounts, setAccounts] = useState<AccountType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const fetchedAccounts = await GetAccounts();
        setAccounts(fetchedAccounts);
      } catch (error) {
        console.error('Failed to fetch accounts:', error);
      } finally {
        setLoading(false);
      }
    };

    void fetchAccounts();
  }, []);

  const totalBalance = accounts.reduce(
    (sum, account) => sum + account.balance,
    0
  );

  if (loading) {
    return (
      <MainLayout>
        <div className="flex h-screen items-center justify-center">
          <p className="text-xl text-gray-500">Loading accounts...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="mb-4 text-5xl font-bold text-gray-800">
              My Accounts
            </h1>
            <p className="mb-6 text-xl text-gray-500">
              Total Balance: {totalBalance.toLocaleString()}€
            </p>
          </div>
          <DialogAddAccounts />
        </div>

        <AccountsCard data={accounts} />
      </div>
    </MainLayout>
  );
};

export default Accounts;
