import { z } from 'zod';

export const AccountTypeEnum_ = z.enum([
  'savings', // Épargne
  'checking', // Courant
  'business', // Entreprise
  'joint', // Commun
  'salary', // Salaire
  'investment', // Investissement
  'retirement', // Retraite
  'youth', // Jeune
  'premium', // Premium
  'home savings plan', // Plan Épargne Logement
  'housing savings account', // Compte Épargne Logement
  'livret A', // Livret A
  'youth savings', // Livret Jeune
]);

export enum AccountTypeEnum {
  savings = 'savings',
  checking = 'checking',
  business = 'business',
  joint = 'joint',
  salary = 'salary',
  investment = 'investment',
  retirement = 'retirement',
  youth = 'youth',
  premium = 'premium',
  homeSavingsPlan = 'home savings plan',
  homeousingSavingsAccount = 'housing savings account',
  livretA = 'livret A',
  youthSavings = 'youth savings',
}

export const AccountSchema = z.object({
  id: z.string().min(1).max(34),
  uuid: z.string().min(1),
  name: z.string().min(1).max(100),
  balance: z.number().default(0.0),
  state: z.boolean().default(true),
  is_main: z.boolean().default(false),
  created_at: z.string(),
  type: AccountTypeEnum_.default('savings'),
});

export const AccountsArraySchema = z.array(AccountSchema);

export type AccountType = z.infer<typeof AccountSchema>;

export const CreateAccountSchema = z.object({
  name: z.string().min(1).max(100),
  type: z.nativeEnum(AccountTypeEnum).default(AccountTypeEnum.savings),
});

export type CreateAccountType = z.infer<typeof CreateAccountSchema>;
