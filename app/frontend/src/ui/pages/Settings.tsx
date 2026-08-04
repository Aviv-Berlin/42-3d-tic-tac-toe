import SecondaryButton from '../components/SecondaryButton';
import MainLayout from '../layouts/MainLayout';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Input from '../components/Input';
import { useUsername } from '../../store/username';
import SubmitButton from '../components/SubmitButton';

const Settings = () => {
  const username = useUsername();
  const [newUsername, setNewUsername] = useState(username)
  const [triggerChangeUsername, setTriggerChangeUsername] = useState(false);
  const [triggerChangePassword, setTriggerChangePassword] = useState(false);
  const [triggerDeleteAccount, setTriggerDeleteAccount] = useState(false);

  const navigate = useNavigate();

  const reset = () => {
    setTriggerChangeUsername(false);
    setTriggerChangePassword(false);
    setTriggerDeleteAccount(false);
  }

  const handleTriggerChangeUsername = () => {
    console.log("change username");
    reset();
    setTriggerChangeUsername(true);
  }

  const handleTriggerChangePassword = () => {
    console.log("change password");
    reset();
    setTriggerChangePassword(true);
  }

  const handleTriggerDeleteAccount = () => {
    console.log("delete account");
    reset();
    setTriggerDeleteAccount(true);
  }

  const handleSubmitUsername = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  }

  const handleChangeUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewUsername(e.target.value);
    console.log(e.target.value);
  }

  return (
    <MainLayout>
      <div className="relative flex flex-col items-center gap-8">
        <div className="sm:absolute sm:left-0">
          <SecondaryButton onClick={() => navigate('/home')}>← Back</SecondaryButton>
        </div>
        <h1 className="text-4xl font-serif italic mb-8">Settings</h1>
        {triggerChangeUsername &&
          <>
            <SecondaryButton onClick={reset}>Cancel</SecondaryButton>
            <h2 className="text-2xl font-serif italic">Change username</h2>
            <form className="flex flex-col gap" onSubmit={handleSubmitUsername}>
              <Input name="new username" value={newUsername} handler={handleChangeUsername} />
              <SubmitButton>Change username</SubmitButton>
            </form>
          </>
        }
        {triggerChangePassword &&
          <SecondaryButton onClick={reset}>Cancel</SecondaryButton>
        }
        {triggerDeleteAccount &&
          <SecondaryButton onClick={reset}>Cancel</SecondaryButton>
        }
        {!triggerChangeUsername && !triggerChangePassword && !triggerDeleteAccount &&
          <>
            <SecondaryButton onClick={handleTriggerChangeUsername}>Change username</SecondaryButton>
            <SecondaryButton onClick={handleTriggerChangePassword}>Change password</SecondaryButton>
            <SecondaryButton onClick={handleTriggerDeleteAccount}>Delete account</SecondaryButton>
          </>
        }
      </div>
    </MainLayout>
  )
}

export default Settings
