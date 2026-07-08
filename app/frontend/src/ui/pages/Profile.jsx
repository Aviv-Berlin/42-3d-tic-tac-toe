import { useNavigate, useSearchParams } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';

const Profile = () => {
  const [searchParams] = useSearchParams();

  const username = searchParams.get('user') || "";

  return (
    <MainLayout username={username}>
      <h1>Profile</h1>
    </MainLayout>
  )
}

export default Profile
