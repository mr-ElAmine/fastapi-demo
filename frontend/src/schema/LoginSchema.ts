import { z } from 'zod';

export const LoginSchema = z.object({
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
});

export type LoginType = z.infer<typeof LoginSchema>;

export const PasswordSchema = z
  .object({
    oldPassword: z.string().nonempty('Ancien mot de passe requis'),
    newPassword: z
      .string()
      .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        'Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial'
      ),
    confirmNewPassword: z
      .string()
      .nonempty('Confirmation du mot de passe requise'),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmNewPassword'],
  });

export type PasswordType = z.infer<typeof PasswordSchema>;
