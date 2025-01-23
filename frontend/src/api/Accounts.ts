import axios from 'axios';

import config from '@/config';
import type { AccountType, CreateAccountType } from '@/schema/AccountsSchema';
import { AccountsArraySchema } from '@/schema/AccountsSchema';

export async function GetAccounts(): Promise<AccountType[]> {
  try {
    const response = await axios.get(
      `${config.api.baseUrl}${config.api.getAccountsEndpoint}`
    );

    const data = response.data;

    return AccountsArraySchema.parse(data);
  } catch {
    return [];
  }
}

export async function CreatesAccounts({
  data,
}: {
  data: CreateAccountType;
}): Promise<void> {
  await axios.post(
    `${config.api.baseUrl}${config.api.createAccountsEndpoint}`,
    {
      ...data,
    }
  );
}

export async function CloseAccounts({
  accountId,
}: {
  accountId: string;
}): Promise<void> {
  await axios.post(
    `${config.api.baseUrl}${config.api.closeAccountsEndpoint}${accountId}`
  );
}
