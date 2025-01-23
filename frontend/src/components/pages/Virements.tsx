import { useEffect, useState } from 'react';

import { MyBeneficiaries, OtherBeneficiaries } from '@/api/Beneficiaries';
import MainLayout from '@/components/templates/MainLayout.tsx';
import type { BeneficiaryType } from '@/schema/BeneficiariesSchema';

import { Button } from '../atoms/Button';
import TransfersCard from '../organisms/TransfersCard';

const Transfers = () => {
  const [myBeneficiaries, setMyBeneficiaries] = useState<BeneficiaryType[]>([]);
  const [otherBeneficiaries, setOtherBeneficiaries] = useState<
    BeneficiaryType[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchBeneficiaries = async () => {
      try {
        const myData = await MyBeneficiaries();
        const otherData = await OtherBeneficiaries();

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
        <Button
          variant="outline"
          size="lg"
          onClick={() => alert('New Recipient clicked!')}
        >
          Add a recipient
        </Button>
      </div>

      <p>My Account</p>
      <TransfersCard data={myBeneficiaries} />
      <p>Added</p>
      <TransfersCard data={otherBeneficiaries} />
    </MainLayout>
  );
};

export default Transfers;
