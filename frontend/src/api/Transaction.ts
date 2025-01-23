import axios from 'axios';

import config from '@/config';
import type {
  TransactionPendingType,
  TransactionCreateType,
  TransactionAutoType,
} from '@/schema/TransactionSchema';
import { TransactionPendingListSchema } from '@/schema/TransactionSchema';

// Fonction pour effectuer une transaction
export async function makeTransaction({
  data,
}: {
  data: TransactionCreateType;
}): Promise<void> {
  await axios.post(
    `${config.api.baseUrl}${config.api.makeTransactionEndpoint}`,
    {
      ...data,
    }
  );
}

export async function pendingTransactions(): Promise<TransactionPendingType[]> {
  try {
    const response = await axios.get(
      `${config.api.baseUrl}${config.api.pendingTransactionsEndpoint}`
    );

    return TransactionPendingListSchema.parse(response.data);
  } catch {
    return [];
  }
}

export async function cancelTransaction({
  transactionId,
}: {
  transactionId: number;
}) {
  return await axios.post(
    `${config.api.baseUrl}${config.api.cancelTransactionEndpoint}${transactionId}`
  );
}

export const CreateTransactionAuto = async ({
  data,
}: {
  data: TransactionAutoType;
}) => {
  return axios.post(
    `${config.api.baseUrl}${config.api.makeTransactionAutoEndpoint}`,
    { ...data }
  );
};
