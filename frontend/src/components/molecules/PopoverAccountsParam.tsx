import { MoreHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { CloseAccounts } from '@/api/Accounts';
import type { AccountType } from '@/schema/AccountsSchema';

import { Button } from '../atoms/Button';
import { Popover, PopoverContent, PopoverTrigger } from '../atoms/Popover';

export const PopoverAccountsParam = ({ data }: { data: AccountType }) => {
  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      await CloseAccounts({ accountId: data.id });
      await navigate(0);
    } catch {}
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon">
          <MoreHorizontal />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="border-2 border-black bg-white">
        <div className="flex flex-col space-y-2">
          <Button
            variant="outline"
            className="bg-red-100 text-red-600 hover:bg-red-200"
            onClick={handleDelete}
          >
            Delete
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
