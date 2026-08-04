import SecondaryButton from '../components/SecondaryButton';
import MainLayout from '../layouts/MainLayout';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const Settings = () => {
  const [changeUsername, setChangeUsername] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  const [deleteAccount, setDeleteAccount] = useState(false);

  const navigate = useNavigate();

  const handleChangeUsername = () => {
    console.log("change username");
    setChangeUsername(true);
  }

  const handleChangePassword = () => {
    console.log("change password");
    setChangePassword(true);
  }

  const handleDeleteAccount = () => {
    console.log("delete account");
    setDeleteAccount(true);
  }

  return (
    <MainLayout>
      <div className="relative flex flex-col items-center gap-8">
        <div className="sm:absolute sm:left-0">
          <SecondaryButton onClick={() => navigate('/home')}>← Back</SecondaryButton>
        </div>
        <h1 className="text-3xl font-serif italic">Settings</h1>
        <SecondaryButton onClick={handleChangeUsername}>Change username</SecondaryButton>
        <SecondaryButton onClick={handleChangePassword}>Change password</SecondaryButton>
        <SecondaryButton onClick={handleDeleteAccount}>Delete account</SecondaryButton>
      </div>
    </MainLayout>
  )
}

export default Settings
