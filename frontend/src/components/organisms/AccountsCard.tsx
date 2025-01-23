import type { AccountType } from '@/schema/AccountsSchema';

import Card from '../atoms/Card';
import { PopoverAccountsParam } from '../molecules/PopoverAccountsParam';

const AccountsCard = ({ data }: { data: AccountType[] }) => {
  return (
    <div className="flex flex-wrap gap-4">
      {data.map((account, index) => (
        <div className="w-full" key={index}>
          <Card>
            <div className="relative mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">{account.name}</h3>
                <h4 className="text-md font-bold text-gray-500">
                  {account.type}
                </h4>
              </div>
              <PopoverAccountsParam data={account} />
            </div>
            <div className="mb-4 flex items-center justify-between text-2xl font-bold">
              <span>{account.balance} €</span>
              <span className="text-sm text-gray-500">{account.id}</span>
            </div>
          </Card>
        </div>
      ))}
    </div>
  );
};

export default AccountsCard;
