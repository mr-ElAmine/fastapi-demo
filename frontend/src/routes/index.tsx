import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Accounts from '@/components/pages/Accounts';
import Home from '@/components/pages/Home.tsx';
import Login from '@/components/pages/Login';
import NotFound from '@/components/pages/NotFound.tsx';
import Register from '@/components/pages/Register';
import Transfers from '@/components/pages/Virements';

const RouterApp = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/accounts" element={<Accounts />} />
        <Route path="/transfers" element={<Transfers />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default RouterApp;
