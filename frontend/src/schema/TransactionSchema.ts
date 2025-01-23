import { z } from 'zod';

export const TransactionCreateSchema = z.object({
  amount: z
    .number()
    .positive({ message: 'Transaction amount must be greater than 0' })
    .describe('Transaction amount'),
  id_account_sender: z
    .string()
    .min(1, { message: 'Sender account ID is required' })
    .describe("ID of the sender's account"),
  id_account_receiver: z
    .string()
    .min(1, { message: 'Receiver account ID is required' })
    .describe("ID of the receiver's account"),
  label: z.string().default('').describe('Label for the transaction'),
});

export type TransactionCreateType = z.infer<typeof TransactionCreateSchema>;

export const TransactionPendingSchema = z.object({
  id: z.number().int().nonnegative().describe('Transaction ID'),
  amount: z.number().positive().describe('Transaction amount'),
  id_account_sender: z.string().min(1).describe('Sender account ID'),
  id_account_receiver: z.string().min(1).describe('Receiver account ID'),
  date: z.string().describe('Transaction date'),
  label: z.string().nullable().optional().describe('Transaction label'),
});

export const TransactionPendingListSchema = z.array(TransactionPendingSchema);
export type TransactionPendingType = z.infer<typeof TransactionPendingSchema>;

export const TransactionAutoSchema = z.object({
  sender_account_id: z.string().min(1, 'Sender Account ID is required'),
  receiver_account_id: z.string().min(1, 'Receiver Account ID is required'),
  frequency: z.enum(['daily', 'weekly', 'monthly']),
  start_day: z.string().min(1, 'Start Day is required'),
  amount: z.number().positive('Amount must be a positive number'),
});

export type TransactionAutoType = z.infer<typeof TransactionAutoSchema>;
