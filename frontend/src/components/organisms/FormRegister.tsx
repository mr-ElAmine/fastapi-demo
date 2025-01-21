import { Eye, EyeOff } from 'lucide-react';
import React, { useState } from 'react';

import Input from '../atoms/Input';

const FormRegister = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [formMessage, setFormMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.email || !formData.password || !formData.confirmPassword) {
      setFormMessage('Tous les champs sont obligatoires.');
      return;
    }

    if (formData.password.length < 7) {
      setFormMessage('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setFormMessage('Les mots de passe ne correspondent pas.');
      return;
    }

    setFormMessage('Formulaire soumis avec succès !');
    console.log('Form Data:', formData);
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center justify-center rounded-md bg-white p-4">
      <h1 className="mb-4 text-2xl font-bold text-gray-800">Register</h1>
      <form onSubmit={handleSubmit} className="flex w-full flex-col gap-5">
        <Input
          id="email"
          type="email"
          label="Adresse e-mail"
          placeholder="Entrez votre e-mail"
          value={formData.email}
          onChange={handleChange}
          message={!formData.email && formMessage ? 'Ce champ est requis.' : ''}
          messageType="error"
        />
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            label="Mot de passe"
            placeholder="Entrez votre mot de passe"
            value={formData.password}
            onChange={handleChange}
            message={
              formData.password.length < 7 && formMessage
                ? 'Le mot de passe est trop court.'
                : ''
            }
            messageType="error"
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-[33px] text-sm text-gray-600 hover:text-gray-800"
          >
            {showPassword ? <EyeOff /> : <Eye />}
          </button>
        </div>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            label="Confirmez le mot de passe"
            placeholder="Confirmez votre mot de passe"
            value={formData.confirmPassword}
            onChange={handleChange}
            message={
              formData.password !== formData.confirmPassword && formMessage
                ? 'Les mots de passe ne correspondent pas.'
                : ''
            }
            messageType="error"
          />
          <button
            type="button"
            onClick={toggleConfirmPasswordVisibility}
            className="absolute right-3 top-[33px] text-sm text-gray-600 hover:text-gray-800"
          >
            {showConfirmPassword ? <EyeOff /> : <Eye />}
          </button>
        </div>
        <button
          type="submit"
          className="mt-4 w-full rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          Soumettre
        </button>
      </form>
      {formMessage && (
        <p
          className={`mt-4 text-center text-sm ${
            formMessage.includes('succès') ? 'text-green-500' : 'text-red-500'
          }`}
        >
          {formMessage}
        </p>
      )}
    </div>
  );
};

export default FormRegister;
