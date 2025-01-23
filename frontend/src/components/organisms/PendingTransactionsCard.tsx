import { cancelTransaction } from '@/api/Transaction';
import type { TransactionPendingType } from '@/schema/TransactionSchema';

import { Button } from '../atoms/Button';
import Card from '../atoms/Card';

const PendingTransactionsCard = ({
  data,
}: {
  data: TransactionPendingType[];
}) => {
  const handleCancelTransaction = async (transactionId: number) => {
    try {
      await cancelTransaction({ transactionId });
    } catch (error) {
      console.error(error);
    }
  };

  if (!data || data.length === 0) {
    return (
      <div>
        <div>Transactions pending</div>
        <p className="text-gray-500">No pending transactions available.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 border-l border-black pl-5">
      <div>Transactions pending</div>
      {data.map((transaction) => (
        <div className="w-full" key={transaction.id}>
          <Card>
            <div className="flex justify-between">
              <div className="mb-4">
                <h3 className="text-lg font-semibold">
                  Transaction #{transaction.id}
                </h3>
                <p className="text-sm text-gray-500">
                  <span className="font-bold">Date :</span>{' '}
                  {new Date(transaction.date).toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">
                  <span className="font-bold">Expéditeur :</span>{' '}
                  {transaction.id_account_sender}
                </p>
                <p className="text-sm text-gray-500">
                  <span className="font-bold">Destinataire :</span>{' '}
                  {transaction.id_account_receiver}
                </p>
              </div>
              <Button
                aria-label={`Cancel transaction ${transaction.id}`}
                onClick={() => handleCancelTransaction(transaction.id)}
                variant="outline"
                className="border-red-700 bg-red-200 hover:bg-red-300"
              >
                cancel transaction
              </Button>
            </div>
            <div className="flex items-center justify-between text-2xl font-bold">
              <span>{transaction.amount} €</span>
              {transaction.label && (
                <>
                  <span className="text-sm text-gray-500">
                    {transaction.label}
                  </span>
                </>
              )}
            </div>
          </Card>
        </div>
      ))}
    </div>
  );
};

export default PendingTransactionsCard;
