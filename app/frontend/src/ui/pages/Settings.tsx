import SecondaryButton from '../components/SecondaryButton';
import MainLayout from '../layouts/MainLayout';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Input from '../components/Input';
import { useUsername } from '../../store/username';
import SubmitButton from '../components/SubmitButton';

const Settings = () => {
  const username = useUsername();
  const [newUsername, setNewUsername] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [triggerChangeUsername, setTriggerChangeUsername] = useState(false);
  const [triggerChangePassword, setTriggerChangePassword] = useState(false);
  const [triggerDeleteAccount, setTriggerDeleteAccount] = useState(false);

  const navigate = useNavigate();

  const reset = () => {
    setTriggerChangeUsername(false);
    setTriggerChangePassword(false);
    setTriggerDeleteAccount(false);
    setNewUsername("");
    setOldPassword("");
    setNewPassword("");
  }

  const handleTriggerChangeUsername = () => {
    reset();
    setTriggerChangeUsername(true);
  }

  const handleTriggerChangePassword = () => {
    reset();
    setTriggerChangePassword(true);
  }

  const handleTriggerDeleteAccount = () => {
    reset();
    setTriggerDeleteAccount(true);
  }

  const handleSubmitChangeUsername = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // here we send the new username to the backend with a PUT request
  }

  const handleSubmitChangePassword = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // here we send the new and the old password to the backend with a PUT request
    // check if the old password matches with what stored in the db
    // if it matches update with the new password
  }

  const handleSubmitDeleteAccount = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // here we delete the account with a DELETE request
    // check if the password matches with what stored in the db
  }

  const handleChangeUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewUsername(e.target.value);
    console.log(e.target.value);
  }

  const handleChangeOldPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOldPassword(e.target.value);
    console.log(e.target.value);
  }

  const handleChangeNewPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassword(e.target.value);
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
          <div className="w-80 flex flex-col gap-4">
            <SecondaryButton onClick={reset}>Cancel</SecondaryButton>
            <h2 className="text-2xl font-serif italic">Change username</h2>
            <form className="flex flex-col gap" onSubmit={handleSubmitChangeUsername}>
              <Input name="new username" value={newUsername} handler={handleChangeUsername} />
              <SubmitButton>Change username</SubmitButton>
            </form>
          </div>
        }
        {triggerChangePassword &&
          <div className="w-80 flex flex-col gap-4">
            <SecondaryButton onClick={reset}>Cancel</SecondaryButton>
            <h2 className="text-2xl font-serif italic">Change password</h2>
            <form className="flex flex-col gap" onSubmit={handleSubmitChangePassword}>
              <Input name="old password" value={oldPassword} handler={handleChangeOldPassword} />
              <Input name="new password" value={newPassword} handler={handleChangeNewPassword} />
              <SubmitButton>Change password</SubmitButton>
            </form>
          </div>
        }
        {triggerDeleteAccount &&
          <div className="w-80 flex flex-col gap-4">
            <SecondaryButton onClick={reset}>Cancel</SecondaryButton>
            <h2 className="text-2xl font-serif italic">Delete account</h2>
            <p>Deleting your account will remove your information from our database. This is not reversible.</p>
            <form className="flex flex-col gap" onSubmit={handleSubmitDeleteAccount}>
              <Input name="password" value={oldPassword} handler={handleChangeOldPassword} />
              <SubmitButton>Delete account</SubmitButton>
            </form>
          </div>
        }
        {!triggerChangeUsername && !triggerChangePassword && !triggerDeleteAccount &&
          <div className="w-60 flex flex-col gap-8">
            <SecondaryButton onClick={handleTriggerChangeUsername}>Change username</SecondaryButton>
            <SecondaryButton onClick={handleTriggerChangePassword}>Change password</SecondaryButton>
            <SecondaryButton onClick={handleTriggerDeleteAccount}>Delete account</SecondaryButton>
          </div>
        }
      </div>
    </MainLayout>
  )
}

export default Settings
