import MainLayout from '@/components/templates/MainLayout.tsx';

import { Button } from '../atoms/Button';
import AccountsCard from '../organisms/AccountsCard';

const Accounts = () => {
  return (
    <MainLayout>
      <div className="relative">
        <h1 className="mb-4 text-5xl font-bold text-gray-800">My Accounts</h1>
        <p className="mb-6 text-xl text-gray-500">Total Balance : 884852495€</p>
        <Button
          onClick={() => alert('New Account clicked!')}
          className="absolute right-0 top-0 rounded-lg bg-blue-600 text-xl text-white"
        >
          New Account
        </Button>

        <AccountsCard />
      </div>
    </MainLayout>
  );
};

export default Accounts;
