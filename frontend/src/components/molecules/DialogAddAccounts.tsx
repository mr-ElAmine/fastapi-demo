import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

import { CreatesAccounts } from '@/api/Accounts';
import { AccountTypeEnum, CreateAccountSchema } from '@/schema/AccountsSchema';

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

export const DialogAddAccounts = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [selectedType, setSelectedType] = useState<AccountTypeEnum>(
    AccountTypeEnum.savings
  );
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState('');

  const options = Object.keys(AccountTypeEnum).map((type) => ({
    value: type,
    label: type.charAt(0).toUpperCase() + type.slice(1),
  }));

  const resetForm = () => {
    setName('');
    setSelectedType(AccountTypeEnum.savings);
    setErrors({});
    setOpen(false);
    void navigate(0);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      CreateAccountSchema.parse({ name, type: selectedType });
      await CreatesAccounts({
        data: {
          name: name,
          type: selectedType,
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
        setError("Une erreur s'est produite veuillez réessayer ultérieurement");
        setErrors({});
      }

      setOpen(true);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="lg">
          New Account
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a New Account</DialogTitle>
          <DialogDescription>
            Please enter the details for the new account.
          </DialogDescription>
        </DialogHeader>
        {error && (
          <p className="mb-4 border-2 border-red-600 bg-red-100 p-2 text-center text-sm font-semibold text-red-500">
            {error}
          </p>
        )}
        <form className="space-y-4">
          <CustomSelect
            label="Choose Account Type"
            options={options}
            placeholder="Select account type"
            value={selectedType}
            onChange={(value) => {
              setSelectedType(value as AccountTypeEnum);
            }}
          />
          <Input
            id="account-name"
            label="Account Name"
            placeholder="Enter account name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
            message={errors.name}
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
            <Button onClick={handleSubmit} variant="outline" size="sm">
              Add Account
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
