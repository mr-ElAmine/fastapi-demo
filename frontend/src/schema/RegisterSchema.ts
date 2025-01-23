import { z } from 'zod';

export const RegisterSchema = z
  .object({
    firstName: z
      .string()
      .min(1, { message: 'Le prénom est obligatoire.' })
      .max(50, { message: 'Le prénom ne peut pas dépasser 50 caractères.' }),
    lastName: z
      .string()
      .min(1, { message: 'Le nom est obligatoire.' })
      .max(50, { message: 'Le nom ne peut pas dépasser 50 caractères.' }),
    email: z.string().email({ message: "L'adresse e-mail est invalide." }),
    password: z
      .string()
      .min(8, {
        message: 'Le mot de passe doit contenir au moins 8 caractères.',
      })
      .max(100, {
        message: 'Le mot de passe ne peut pas dépasser 100 caractères.',
      })
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        {
          message:
            'Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre, un caractère spécial (@$!%*?&) et être composé de 8 caractères minimum.',
        }
      ),
    confirmPassword: z
      .string()
      .min(8, { message: 'La confirmation du mot de passe est obligatoire.' })
      .max(100, {
        message:
          'La confirmation du mot de passe ne peut pas dépasser 100 caractères.',
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas.',
    path: ['confirmPassword'],
  });

export type RegisterType = z.infer<typeof RegisterSchema>;
