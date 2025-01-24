import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

import { CloseAccounts } from '@/api/Accounts';
import { CloseAccountSchema } from '@/schema/AccountsSchema';

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

export const DialogCloseAccount = ({ accountId }: { accountId: string }) => {
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState('');

  const resetForm = () => {
    setPassword('');
    setErrors({});
    setError('');
    setOpen(false);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      // Validation avec Zod
      CloseAccountSchema.parse({ password, account_id: accountId });

      // Appel API pour fermer le compte
      await CloseAccounts({
        data: { password: password, account_id: accountId },
      });
      await navigate(0);
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
        <Button
          className="bg-red-100 text-red-600 hover:bg-red-200"
          variant="outline"
          size="lg"
        >
          Close Account
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Close Account</DialogTitle>
          <DialogDescription>
            Please enter your password to confirm account closure.
          </DialogDescription>
        </DialogHeader>
        {error && (
          <p className="mb-4 border-2 border-red-600 bg-red-100 p-2 text-center text-sm font-semibold text-red-500">
            {error}
          </p>
        )}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input
            id="password"
            label="Password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            message={errors.password}
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
              Confirm
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
