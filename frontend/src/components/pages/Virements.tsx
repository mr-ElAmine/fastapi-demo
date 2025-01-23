import { useEffect, useState } from 'react';

import { MyBeneficiaries, OtherBeneficiaries } from '@/api/Beneficiaries';
import { pendingTransactions } from '@/api/Transaction';
import MainLayout from '@/components/templates/MainLayout.tsx';
import type { BeneficiaryType } from '@/schema/BeneficiariesSchema';
import type { TransactionPendingType } from '@/schema/TransactionSchema';

import { DialogAddBeneficiary } from '../molecules/DialogAddBeneficiary';
import PendingTransactionsCard from '../organisms/PendingTransactionsCard';
import TransfersCard from '../organisms/TransfersCard';

const Transfers = () => {
  const [myBeneficiaries, setMyBeneficiaries] = useState<BeneficiaryType[]>([]);
  const [otherBeneficiaries, setOtherBeneficiaries] = useState<
    BeneficiaryType[]
  >([]);
  const [transactions, setTransactions] = useState<TransactionPendingType[]>(
    []
  );

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchBeneficiaries = async () => {
      try {
        const myData = await MyBeneficiaries();
        const otherData = await OtherBeneficiaries();
        const data = await pendingTransactions();

        setTransactions(data);
        setMyBeneficiaries(myData);
        setOtherBeneficiaries(otherData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    void fetchBeneficiaries();
  }, []);

  useEffect(() => {
    const interval = setInterval(async () => {
      const transactionsData = await pendingTransactions();
      setTransactions(transactionsData);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex h-screen items-center justify-center">
          <p className="text-xl text-gray-500">Chargement des données...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-4 text-5xl font-bold text-gray-800">Transfers</h1>
          <p className="mb-6 text-xl text-gray-500">My Recipients</p>
        </div>
        <DialogAddBeneficiary />
      </div>
      <div className="flex w-full">
        <div className="w-full">
          <p>My Account</p>
          <TransfersCard data={myBeneficiaries} />
          <p>Added</p>
          <TransfersCard data={otherBeneficiaries} />
        </div>
        <div className="w-full">
          <PendingTransactionsCard data={transactions} />
        </div>
      </div>
    </MainLayout>
  );
};

export default Transfers;
