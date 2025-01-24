import { MoreHorizontal } from 'lucide-react';

import type { AccountType } from '@/schema/AccountsSchema';

import { Button } from '../atoms/Button';
import { Popover, PopoverContent, PopoverTrigger } from '../atoms/Popover';

import { DialogCloseAccount } from './DialogCloseAccount';

export const PopoverAccountsParam = ({ data }: { data: AccountType }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon">
          <MoreHorizontal />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="border-2 border-black bg-white">
        <div className="flex flex-col space-y-2">
          <DialogCloseAccount accountId={data.id} />
        </div>
      </PopoverContent>
    </Popover>
  );
};
