import { Eye, EyeOff } from 'lucide-react';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';

import { Register } from '@/api/Register';
import { RegisterSchema } from '@/schema/RegisterSchema';

import { Button } from '../atoms/Button';
import Input from '../atoms/Input';

const FormRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [formMessage, setFormMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      RegisterSchema.parse(formData);
      setFormMessage('Connexion réussie !');

      await Register({ ...formData });
      setTimeout(async () => {
        await navigate('/login');
      }, 3 * 1000);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const message = error.errors[0]?.message || 'Erreur de validation.';
        setFormMessage(message);
      } else {
        setFormMessage(
          "Une erreur s'est produite veuillez réessayer ultérieurement"
        );
      }
    } finally {
      setLoading(false);
    }
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
      {formMessage && (
        <p className="mb-4 border-2 border-red-600 bg-red-100 p-2 text-center text-sm font-semibold text-red-500">
          {formMessage}
        </p>
      )}
      <form onSubmit={handleSubmit} className="flex w-full flex-col gap-5">
        <Input
          id="firstName"
          type="text"
          label="Prénom"
          placeholder="Entrez votre prénom"
          value={formData.firstName}
          onChange={handleChange}
          message={
            !formData.firstName && formMessage ? 'Ce champ est requis.' : ''
          }
          messageType="error"
        />
        <Input
          id="lastName"
          type="text"
          label="Nom de famille"
          placeholder="Entrez votre nom de famille"
          value={formData.lastName}
          onChange={handleChange}
          message={
            !formData.lastName && formMessage ? 'Ce champ est requis.' : ''
          }
          messageType="error"
        />
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
        <Button disabled={loading} type="submit" variant="outline">
          Soumettre
        </Button>
      </form>
      <div className="mt-4 underline">
        <Link to="/login">Go to Login</Link>
      </div>
    </div>
  );
};

export default FormRegister;
