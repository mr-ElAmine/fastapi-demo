import React, { useState } from 'react';
import { z } from 'zod';

import { AddBeneficiaries } from '@/api/Beneficiaries';
import { CreateBeneficiarySchema } from '@/schema/BeneficiariesSchema';

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

export const DialogAddBeneficiary = () => {
  const [name, setName] = useState('');
  const [beneficiaryAccountId, setBeneficiaryAccountId] = useState('');
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState('');

  const resetForm = () => {
    setName('');
    setBeneficiaryAccountId('');
    setErrors({});
    setOpen(false);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      // Validation avec Zod
      CreateBeneficiarySchema.parse({
        name,
        beneficiary_account_id: beneficiaryAccountId,
      });

      // Appel API pour créer le bénéficiaire
      await AddBeneficiaries({
        data: {
          name,
          beneficiary_account_id: beneficiaryAccountId,
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
          New Beneficiary
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a New Beneficiary</DialogTitle>
          <DialogDescription>
            Please enter the beneficiary's details.
          </DialogDescription>
        </DialogHeader>
        {error && (
          <p className="mb-4 border-2 border-red-600 bg-red-100 p-2 text-center text-sm font-semibold text-red-500">
            {error}
          </p>
        )}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input
            id="beneficiary-name"
            label="Name"
            placeholder="Enter beneficiary name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
            message={errors.name}
            messageType="error"
          />
          <Input
            id="beneficiary-account-id"
            label="Beneficiary Account ID"
            placeholder="Enter beneficiary account ID"
            value={beneficiaryAccountId}
            onChange={(e) => {
              setBeneficiaryAccountId(e.target.value);
            }}
            message={errors.beneficiary_account_id}
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
              Add Beneficiary
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
