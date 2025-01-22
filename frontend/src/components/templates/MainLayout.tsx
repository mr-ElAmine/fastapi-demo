import type { ReactNode } from 'react';

import { Header } from '@/components/organisms/Header.tsx';

const MainLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex">
      <div className="fixed">
        <Header />
      </div>

      <main className="ml-80 w-full max-w-xl flex-1 overflow-auto bg-gray-100">
        <div className="p-4">{children}</div>
      </main>
    </div>
  );
};

export default MainLayout;
