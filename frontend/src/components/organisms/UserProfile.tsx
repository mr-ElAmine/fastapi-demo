import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Eye, EyeOff } from 'lucide-react';
import React, { useState } from 'react';

import Input from '../atoms/Input';

function UserProfile() {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmPassword] = useState(false);

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
        <h1 className="mb-4 text-2xl font-bold">Change password</h1>
        <Formik
          initialValues={{
            oldPassword: '',
            newPassword: '',
            confirmNewPassword: '',
          }}
          validate={(values) => {
            const errors: { [key: string]: string } = {};
            if (!values.oldPassword) {
              errors.oldPassword = 'Ancien mot de passe requis';
            }
            if (!values.newPassword) {
              errors.newPassword = 'Nouveau mot de passe requis';
            } else if (values.newPassword.length < 8) {
              errors.newPassword =
                'Le mot de passe doit contenir au moins 8 caractères';
            } else if (
              !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
                values.newPassword
              )
            ) {
              errors.newPassword =
                'Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial';
            }
            if (!values.confirmNewPassword) {
              errors.confirmNewPassword =
                'Confirmation du mot de passe requise';
            } else if (values.newPassword !== values.confirmNewPassword) {
              errors.confirmNewPassword =
                'Les mots de passe ne correspondent pas';
            }
            return errors;
          }}
          onSubmit={(values, { setSubmitting, setStatus }) => {
            setStatus('');
            fetch('/api/change-password', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(values),
            })
              .then((response) => {
                if (!response.ok) {
                  throw new Error('Erreur lors du changement de mot de passe');
                }
                return response.json();
              })
              .then((data) => {
                setStatus(`Mot de passe changé avec succès ! ${data.message} `);
                setSubmitting(false);
              })
              .catch((error) => {
                setStatus(error.message);
                setSubmitting(false);
              });
          }}
        >
          {({ isSubmitting, status }) => (
            <Form className="flex w-full flex-col gap-5">
              <div className="relative">
                <Field
                  as={Input}
                  id="oldPassword"
                  name="oldPassword"
                  type={showOldPassword ? 'text' : 'password'}
                  label="Ancien mot de passe"
                  placeholder="Saisissez votre ancien mot de passe"
                />
                <button
                  type="button"
                  onClick={toggleOldPasswordVisibility}
                  className="absolute right-3 top-[33px] text-sm text-gray-600 hover:text-gray-800"
                >
                  {showOldPassword ? <Eye /> : <EyeOff />}
                </button>
                <ErrorMessage
                  name="oldPassword"
                  component="div"
                  className="text-sm text-red-500"
                />
              </div>
              <div className="relative">
                <Field
                  as={Input}
                  id="newPassword"
                  name="newPassword"
                  type={showNewPassword ? 'text' : 'password'}
                  label="Nouveau mot de passe"
                  placeholder="Saisissez votre nouveau mot de passe"
                />
                <button
                  type="button"
                  onClick={toggleNewPasswordVisibility}
                  className="absolute right-3 top-[33px] text-sm text-gray-600 hover:text-gray-800"
                >
                  {showNewPassword ? <Eye /> : <EyeOff />}
                </button>
                <ErrorMessage
                  name="newPassword"
                  component="div"
                  className="text-sm text-red-500"
                />
              </div>
              <div className="relative">
                <Field
                  as={Input}
                  id="confirmNewPassword"
                  name="confirmNewPassword"
                  type={showConfirmNewPassword ? 'text' : 'password'}
                  label="Confirmez le nouveau mot de passe"
                  placeholder="Confirmez votre nouveau mot de passe"
                />
                <button
                  type="button"
                  onClick={toggleConfirmNewPasswordVisibility}
                  className="absolute right-3 top-[33px] text-sm text-gray-600 hover:text-gray-800"
                >
                  {showConfirmNewPassword ? <Eye /> : <EyeOff />}
                </button>
                <ErrorMessage
                  name="confirmNewPassword"
                  component="div"
                  className="text-sm text-red-500"
                />
              </div>
              <button
                type="submit"
                className="mt-4 w-full rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                disabled={isSubmitting}
              >
                Modifier
              </button>
              {status && (
                <p
                  className={`mt-4 text-center text-sm ${
                    status.includes('succès')
                      ? 'text-green-500'
                      : 'text-red-500'
                  }`}
                >
                  {status}
                </p>
              )}
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default UserProfile;
