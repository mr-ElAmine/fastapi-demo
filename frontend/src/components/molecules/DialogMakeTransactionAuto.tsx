import React, { useState } from 'react';
import { z } from 'zod';

import { CreateTransactionAuto } from '@/api/Transaction';
import { TransactionAutoSchema } from '@/schema/TransactionSchema';

import { Button } from '../atoms/Button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../atoms/Dialog';
import Input from '../atoms/Input';
import { CustomSelect } from '../atoms/Select';

export const DialogMakeTransactionAuto = () => {
  const [senderAccountId, setSenderAccountId] = useState('');
  const [receiverAccountId, setReceiverAccountId] = useState('');
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'monthly'>(
    'daily'
  );
  const [startDay, setStartDay] = useState('');
  const [amount, setAmount] = useState<number>(0);
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState('');

  const frequencyOptions = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
  ];

  const resetForm = () => {
    setSenderAccountId('');
    setReceiverAccountId('');
    setFrequency('daily');
    setStartDay('');
    setAmount(0);
    setErrors({});
    setOpen(false);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      // Validation avec Zod
      TransactionAutoSchema.parse({
        sender_account_id: senderAccountId,
        receiver_account_id: receiverAccountId,
        frequency,
        start_day: startDay,
        amount,
      });

      // Appel API pour créer la transaction
      await CreateTransactionAuto({
        data: {
          sender_account_id: senderAccountId,
          receiver_account_id: receiverAccountId,
          frequency,
          start_day: startDay,
          amount,
        },
      });

      resetForm();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path.length > 0) {
            fieldErrors[err.path[0]] = err.message;
          }
        });
        setErrors(fieldErrors);
      } else {
        setError(
          "Une erreur s'est produite, veuillez réessayer ultérieurement."
        );
        setErrors({});
      }

      setOpen(true);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="lg">
          Make Auto Transaction
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Make an Automatic Transaction</DialogTitle>
          <DialogDescription>
            Configure the details for the automatic transaction.
          </DialogDescription>
        </DialogHeader>
        {error && (
          <p className="mb-4 border-2 border-red-600 bg-red-100 p-2 text-center text-sm font-semibold text-red-500">
            {error}
          </p>
        )}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input
            id="sender-account-id"
            label="Sender Account ID"
            placeholder="Enter sender account ID"
            value={senderAccountId}
            onChange={(e) => {
              setSenderAccountId(e.target.value);
            }}
            message={errors.sender_account_id}
            messageType="error"
          />
          <Input
            id="receiver-account-id"
            label="Receiver Account ID"
            placeholder="Enter receiver account ID"
            value={receiverAccountId}
            onChange={(e) => {
              setReceiverAccountId(e.target.value);
            }}
            message={errors.receiver_account_id}
            messageType="error"
          />
          <Input
            id="amount"
            label="Amount"
            placeholder="Enter transaction amount"
            type="number"
            value={amount.toString()}
            onChange={(e) => {
              setAmount(parseFloat(e.target.value));
            }}
            message={errors.amount}
            messageType="error"
          />
          <CustomSelect
            label="Frequency"
            options={frequencyOptions}
            placeholder="Select frequency"
            value={frequency}
            onChange={(value) => {
              setFrequency(value as 'daily' | 'weekly' | 'monthly');
            }}
          />
          <Input
            id="start-day"
            label="Start Day"
            type="date"
            placeholder="Enter start date"
            value={startDay}
            onChange={(e) => {
              setStartDay(e.target.value);
            }}
            message={errors.start_day}
            messageType="error"
          />
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              size="sm"
              type="button"
              onClick={resetForm}
            >
              Cancel
            </Button>
            <Button variant="outline" size="sm" type="submit">
              Submit
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
