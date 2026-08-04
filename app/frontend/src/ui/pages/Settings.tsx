import SecondaryButton from '../components/SecondaryButton';
import MainLayout from '../layouts/MainLayout';

const Settings = () => {
  const handleChangeUsername = () => {
    console.log("change username");
  }

  const handleChangePassword = () => {
    console.log("change password");
  }

  const handleDeleteAccount = () => {
    console.log("delete account");
  }

  return (
    <MainLayout>
      <div className="flex flex-col items-center gap-8">
        <h1 className="text-3xl font-serif italic">Settings</h1>
        <SecondaryButton onClick={handleChangeUsername}>Change username</SecondaryButton>
        <SecondaryButton onClick={handleChangePassword}>Change password</SecondaryButton>
        <SecondaryButton onClick={handleDeleteAccount}>Delete account</SecondaryButton>
      </div>
    </MainLayout>
  )
}

export default Settings
