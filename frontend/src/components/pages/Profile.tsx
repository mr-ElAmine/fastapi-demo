import UserProfile from '../organisms/UserProfile';
import MainLayout from '../templates/MainLayout';

const Profile = () => {
  return (
    <MainLayout>
      <div className="flex h-full w-full flex-col justify-start">
        <h1 className="mb-8 text-5xl font-bold text-gray-800">Profile</h1>
        <UserProfile />
      </div>
    </MainLayout>
  );
};

export default Profile;
