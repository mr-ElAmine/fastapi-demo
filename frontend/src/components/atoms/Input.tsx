import React from 'react';

interface InputProps {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  message?: string;
  messageType?: 'info' | 'error' | 'success';
  className?: string;
}

const Input: React.FC<InputProps> = ({
  id,
  label,
  type = 'text',
  placeholder = '',
  value,
  onChange,
  disabled = false,
  message = '',
  messageType = 'info',
  className = '',
}) => {
  const messageStyles = {
    info: 'text-blue-500',
    error: 'text-red-500',
    success: 'text-green-500',
  };

  return (
    <div className={`w-full ${className}`}>
      <label
        htmlFor={id}
        className="mb-1 block text-sm font-medium text-gray-700"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100`}
      />
      {message && (
        <p className={`mt-1 text-sm ${messageStyles[messageType]}`}>
          {message}
        </p>
      )}
    </div>
  );
};

export default Input;
