import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from '@/components/pages/Home.tsx';
import NotFound from '@/components/pages/NotFound.tsx';

const RouterApp = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default RouterApp;
