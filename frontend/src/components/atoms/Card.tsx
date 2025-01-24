import type { ReactNode } from 'react';

const Card = ({ children }: { children: ReactNode }) => {
  return (
    <div className="w-full max-w-2xl border-2 border-black bg-transparent p-4">
      {children}
    </div>
  );
};

export default Card;
