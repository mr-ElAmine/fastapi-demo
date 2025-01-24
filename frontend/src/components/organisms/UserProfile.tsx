import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

import { changePassword } from '@/api/Login';
import { PasswordSchema } from '@/schema/LoginSchema';

import { Button } from '../atoms/Button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../atoms/Dialog';
import Input from '../atoms/Input';

function UserProfile() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [open, setOpen] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  const validate = () => {
    const result = PasswordSchema.safeParse({
      oldPassword,
      newPassword,
      confirmNewPassword,
    });

    if (!result.success) {
      const validationErrors: Record<string, string> = {};
      result.error.errors.forEach((error) => {
        if (error.path.length) {
          validationErrors[error.path[0] as string] = error.message;
        }
      });
      setErrors(validationErrors);
      return false;
    }

    setErrors({});
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setOpen(false);
    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    setStatus('');

    try {
      await changePassword({
        data: { oldPassword, newPassword, confirmNewPassword },
      });
      setStatus(`Mot de passe changé avec succès !`);
    } catch (error) {
      if (error instanceof Error) {
        setStatus(error.message);
      } else {
        setStatus('Une erreur inconnue est survenue');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex w-full max-w-md flex-col rounded-md bg-white">
      <div className="flex flex-col bg-gray-50 p-8 pt-6">
        <h1 className="mb-4 text-2xl font-bold">Change password</h1>
        <div className="flex w-full flex-col gap-5">
          <div className="relative">
            <Input
              id="oldPassword"
              type={showOldPassword ? 'text' : 'password'}
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              label="Ancien mot de passe"
              placeholder="Saisissez votre ancien mot de passe"
            />
            <button
              type="button"
              onClick={() => setShowOldPassword((prev) => !prev)}
              className="absolute right-3 top-[33px] text-sm text-gray-600 hover:text-gray-800"
            >
              {showOldPassword ? <Eye /> : <EyeOff />}
            </button>
            {errors.oldPassword && (
              <div className="text-sm text-red-500">{errors.oldPassword}</div>
            )}
          </div>
          <div className="relative">
            <Input
              id="newPassword"
              type={showNewPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              label="Nouveau mot de passe"
              placeholder="Saisissez votre nouveau mot de passe"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword((prev) => !prev)}
              className="absolute right-3 top-[33px] text-sm text-gray-600 hover:text-gray-800"
            >
              {showNewPassword ? <Eye /> : <EyeOff />}
            </button>
            {errors.newPassword && (
              <div className="text-sm text-red-500">{errors.newPassword}</div>
            )}
          </div>
          <div className="relative">
            <Input
              id="confirmNewPassword"
              type={showConfirmNewPassword ? 'text' : 'password'}
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              label="Confirmez le nouveau mot de passe"
              placeholder="Confirmez votre nouveau mot de passe"
            />
            <button
              type="button"
              onClick={() => setShowConfirmNewPassword((prev) => !prev)}
              className="absolute right-3 top-[33px] text-sm text-gray-600 hover:text-gray-800"
            >
              {showConfirmNewPassword ? <Eye /> : <EyeOff />}
            </button>
            {errors.confirmNewPassword && (
              <div className="text-sm text-red-500">
                {errors.confirmNewPassword}
              </div>
            )}
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" disabled={isSubmitting}>
                Modifier
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Êtes-vous sûr ?</DialogTitle>
                <DialogDescription>
                  Cette action changera définitivement votre mot de passe.
                </DialogDescription>
              </DialogHeader>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={handleSubmit}>
                  Confirmer
                </Button>

                <DialogClose asChild>
                  <Button variant="outline">Annuler</Button>
                </DialogClose>
              </div>
            </DialogContent>
          </Dialog>
          {status && (
            <p
              className={`mt-4 text-center text-sm ${
                status.includes('succès') ? 'text-green-500' : 'text-red-500'
              }`}
            >
              {status}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
