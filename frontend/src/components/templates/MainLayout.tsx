import type { ReactNode } from 'react';

import { Header } from '@/components/organisms/Header.tsx';

const MainLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Header />
      <main className="">
        <div className="pt-20">{children}</div>
      </main>
    </>
  );
};

export default MainLayout;
