import { Eye, EyeOff } from 'lucide-react';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';

import { Login } from '@/api/Login';
import useAuth from '@/hooks/use-auth';
import { LoginSchema } from '@/schema/LoginSchema';

import { Button } from '../atoms/Button';
import Input from '../atoms/Input';

const FormLogin = () => {
  const navigate = useNavigate();
  const { setToken } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [formMessage, setFormMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      LoginSchema.parse(formData);
      setFormMessage('Connexion réussie !');

      const login = await Login({ ...formData });
      if (login) {
        setToken(login);
        setTimeout(async () => {
          await navigate('/');
        }, 3 * 1000);
      }
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

  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center justify-center rounded-md bg-white p-4">
      <h1 className="mb-4 text-2xl font-bold text-gray-800">Login</h1>
      {formMessage && (
        <p className="mb-4 border-2 border-red-600 bg-red-100 p-2 text-center text-sm font-semibold text-red-500">
          {formMessage}
        </p>
      )}
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
              formData.password.length < 6 && formMessage
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
            {showPassword ? <Eye /> : <EyeOff />}
          </button>
        </div>
        <Button disabled={loading} type="submit" variant="outline">
          Soumettre
        </Button>
      </form>
      <div className="mt-4 underline">
        <Link to="/register">Go to Register</Link>
      </div>
    </div>
  );
};

export default FormLogin;
