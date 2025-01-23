import MainLayout from '@/components/templates/MainLayout.tsx';

import { Button } from '../atoms/Button';
import TransfersFrom from '../organisms/TransfersForm';

const Transfers = () => {
  return (
    <MainLayout>
      <div className="relative">
        <h1 className="mb-4 text-5xl font-bold text-gray-800">Transfers</h1>
        <p className="mb-6 text-xl text-gray-500">My Recipients</p>
        <Button
          onClick={() => alert('New Recipient clicked!')}
          className="absolute right-0 top-0 rounded-lg bg-blue-600 text-xl text-white"
        >
          Add a recipient
        </Button>

        <TransfersFrom />
      </div>
    </MainLayout>
  );
};

export default Transfers;
