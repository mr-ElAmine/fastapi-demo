import { z } from 'zod';

export const BeneficiarySchema = z.object({
  added_by_user_id: z.number().int().positive(),
  beneficiary_account_id: z.string().min(1),
  id: z.number().int().positive(),
  name: z.string().min(1),
});

export const BeneficiariesTableSchema = z.array(BeneficiarySchema);

export type BeneficiaryType = z.infer<typeof BeneficiarySchema>;

export const CreateBeneficiarySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  beneficiary_account_id: z
    .string()
    .min(1, 'Beneficiary Account ID is required'),
});

export type CreateBeneficiaryType = z.infer<typeof CreateBeneficiarySchema>;
