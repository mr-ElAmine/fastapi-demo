import { Eye, EyeOff } from 'lucide-react';
import React, { useState } from 'react';

import Input from '../atoms/Input';

function UserProfile() {
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  const [formMessage, setFormMessage] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !formData.oldPassword ||
      !formData.newPassword ||
      !formData.confirmNewPassword
    ) {
      setFormMessage('Tous les champs doivent être remplis.');
      return;
    }

    if (formData.newPassword.length < 7) {
      setFormMessage('Le mot de passe doit contenir au moins 8 caractères.');
      return;
    }

    if (formData.newPassword !== formData.confirmNewPassword) {
      setFormMessage('Les mots de passe ne correspondent pas.');
      return;
    }

    if (formData.newPassword === formData.oldPassword) {
      setFormMessage(
        "Le nouveau mot de passe doit être différent de l'ancien."
      );
      return;
    }

    setFormMessage('Mot de passe changé avec succès !');
    console.log('Form Data:', formData);
  };

  const toggleOldPasswordVisibility = () => {
    setShowOldPassword((prev) => !prev);
  };

  const toggleNewPasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleConfirmNewPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  return (
    <div className="flex w-full max-w-md flex-col rounded-md bg-white">
      <div className="flex flex-col bg-gray-50 p-8 pt-6">
        <h1 className="mb-4 text-2xl font-bold">Modifier le mot de passe</h1>
        <form onSubmit={handleSubmit} className="flex w-full flex-col gap-5">
          <div className="relative">
            <Input
              id="oldPassword"
              type={showOldPassword ? 'text' : 'password'}
              label="Ancien mot de passe"
              placeholder="Entrez votre ancien mot de passe"
              value={formData.oldPassword}
              onChange={handleChange}
            />
            <button
              type="button"
              onClick={toggleOldPasswordVisibility}
              className="absolute right-3 top-[33px] text-sm text-gray-600 hover:text-gray-800"
            >
              {showNewPassword ? <Eye /> : <EyeOff />}
            </button>
          </div>
          <div className="relative">
            <Input
              id="newPassword"
              type={showNewPassword ? 'text' : 'password'}
              label="Nouveau mot de passe"
              placeholder="Entrez votre nouveau mot de passe"
              value={formData.newPassword}
              onChange={handleChange}
              message={
                formData.newPassword.length >= 1 &&
                formData.newPassword.length < 7 &&
                formMessage
                  ? 'Le mot de passe doit faire au moins 8 caractères.'
                  : ''
              }
              messageType="error"
            />
            <button
              type="button"
              onClick={toggleNewPasswordVisibility}
              className="absolute right-3 top-[33px] text-sm text-gray-600 hover:text-gray-800"
            >
              {showNewPassword ? <Eye /> : <EyeOff />}
            </button>
          </div>
          <div className="relative">
            <Input
              id="confirmNewPassword"
              type={showConfirmNewPassword ? 'text' : 'password'}
              label="Confirmez le nouveau mot de passe"
              placeholder="Confirmez votre nouveau mot de passe"
              value={formData.confirmNewPassword}
              onChange={handleChange}
              message={
                formData.newPassword !== formData.confirmNewPassword &&
                formMessage
                  ? 'Les mots de passe ne correspondent pas.'
                  : ''
              }
              messageType="error"
            />
            <button
              type="button"
              onClick={toggleConfirmNewPasswordVisibility}
              className="absolute right-3 top-[33px] text-sm text-gray-600 hover:text-gray-800"
            >
              {showConfirmNewPassword ? <Eye /> : <EyeOff />}
            </button>
          </div>
          <button
            type="submit"
            className="mt-4 w-full rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            Modifier
          </button>
        </form>
        {formMessage && (
          <p
            className={`mt-4 text-center text-sm ${
              formMessage.includes('Mot de passe modifié avec succès')
                ? 'text-green-500'
                : 'text-red-500'
            }`}
          >
            {formMessage}
          </p>
        )}
      </div>
    </div>
  );
}

export default UserProfile;
