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

const StateEnum = z.enum([
  'pending',
  'confirmed',
  'cancelled',
  'redirect',
  'close',
  'auto',
  'auto_fail',
]);

// Schéma pour les transactions
const TransactionSchema = z.object({
  type: z.literal('transaction'),
  amount: z.number(),
  sender: z.string(), // ID du compte expéditeur
  receiver: z.string(), // ID du compte destinataire
  state: StateEnum, // État de la transaction
  date: z.string().or(z.date()), // Date au format ISO ou objet Date
  label: z.string().nullable(), // Libellé, optionnel ou null
});

// Schéma pour les transactions en attente
const PendingTransactionSchema = z.object({
  type: z.literal('pending_transaction'),
  amount: z.number(),
  sender: z.string(), // ID du compte expéditeur
  receiver: z.string(), // ID du compte destinataire
  date: z.string().or(z.date()), // Date au format ISO ou objet Date
  label: z.string().nullable(), // Libellé, optionnel ou null
});

// Schéma pour les dépôts
const DepositSchema = z.object({
  type: z.literal('deposit'),
  amount: z.number(),
  state: z.boolean(), // État du dépôt
  date: z.string().or(z.date()), // Date au format ISO ou objet Date
});

// Union des schémas
const CombinedOperationSchema = z.discriminatedUnion('type', [
  TransactionSchema,
  PendingTransactionSchema,
  DepositSchema,
]);

// Schéma pour un tableau d'opérations combinées
export const CombinedOperationsSchema = z.array(CombinedOperationSchema);

export type TransactionType = z.infer<typeof TransactionSchema>;
export type PendingTransactionType = z.infer<typeof PendingTransactionSchema>;
export type DepositType = z.infer<typeof DepositSchema>;
export type CombinedOperationType = z.infer<typeof CombinedOperationSchema>;
