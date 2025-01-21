import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex h-screen flex-col items-center justify-center text-center">
      <h1 className="mb-4 text-6xl font-bold">404</h1>
      <p className="mb-8 text-lg">Oops! Page not found.</p>
      <Link to="/" className="text-blue-500 hover:underline">
        Return to Home
      </Link>
    </div>
  );
};

export default NotFound;
