import { createRoot } from 'react-dom/client';

import App from './App.tsx';
import './style/index.css';

const rootElement = document.getElementById('root');

const root = createRoot(rootElement!);

root.render(<App />);
