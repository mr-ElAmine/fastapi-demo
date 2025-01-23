import { z } from 'zod';

export const BeneficiarySchema = z.object({
  added_by_user_id: z.number().int().positive(),
  beneficiary_account_id: z.string().min(1),
  id: z.number().int().positive(),
  name: z.string().min(1),
});

export const BeneficiariesTableSchema = z.array(BeneficiarySchema);

export type BeneficiaryType = z.infer<typeof BeneficiarySchema>;
