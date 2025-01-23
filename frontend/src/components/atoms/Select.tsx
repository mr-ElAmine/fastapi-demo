import * as Select from '@radix-ui/react-select';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { ReactNode } from 'react';
import { useState } from 'react';

interface SelectOption {
  value: string;
  label: ReactNode;
}

interface CustomSelectProps {
  options: SelectOption[];
  placeholder?: string;
  label: ReactNode;
  onChange?: (value: string) => void;
  value?: string;
  defaultValue?: string;
  className?: string;
}

export const CustomSelect = ({
  options,
  placeholder = 'Choisir une option',
  label,
  onChange,
  value,
  defaultValue,
  className = '',
}: CustomSelectProps) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full">
      <label className="mb-1 block text-sm font-medium text-gray-700">
        {label}
      </label>
      <Select.Root
        open={open}
        onOpenChange={setOpen}
        value={value}
        defaultValue={defaultValue}
        onValueChange={(value) => {
          onChange?.(value);
        }}
      >
        <Select.Trigger
          className={`border-blac border-blac relative flex w-full items-center justify-between rounded-md border-2 border-black bg-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500 ${className}`}
          aria-label={placeholder}
        >
          <Select.Value placeholder={placeholder} />
          <div>{open ? <ChevronUp /> : <ChevronDown />}</div>
        </Select.Trigger>

        <Select.Portal>
          <Select.Content
            className="z-50 w-[484px] rounded-md border-2 border-black bg-white shadow-lg"
            position="popper"
            aria-label="Dropdown menu"
          >
            <Select.Viewport>
              {options.length > 0 ? (
                options.map((option) => (
                  <Select.Item
                    key={option.value}
                    value={option.value}
                    className="cursor-pointer rounded-md border border-black px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:bg-gray-500 focus:text-white"
                  >
                    <Select.ItemText>{option.label}</Select.ItemText>
                  </Select.Item>
                ))
              ) : (
                <div className="p-4 text-sm text-gray-500">
                  No options available
                </div>
              )}
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </div>
  );
};
