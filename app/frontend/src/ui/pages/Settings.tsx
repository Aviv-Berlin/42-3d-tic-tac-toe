import SecondaryButton from '../components/SecondaryButton';
import MainLayout from '../layouts/MainLayout';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Input from '../components/Input';
import SubmitButton from '../components/SubmitButton';

import settings from '../../services/settings';
import { useUsername, useSetUsername } from '../../store/username';

const Settings = () => {
  const [submit, setSubmit] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [triggerChangeUsername, setTriggerChangeUsername] = useState(false);
  const [triggerChangePassword, setTriggerChangePassword] = useState(false);
  const [triggerDeleteAccount, setTriggerDeleteAccount] = useState(false);
  const username = useUsername();
  const setUsername = useSetUsername();	
  
  const navigate = useNavigate();

  const reset = () => {
    setSubmit(false);
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

  const handleSubmitChangeUsername = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmit(true);

	const form = {
		oldUsername: username,
		newUsername
	}

	try {
		const response = await settings.changeUsername(form);
		setUsername(response.data.username);
		//navigate('/success'); // navigate to a success page or show a success message
	} catch (err) {
		console.error(err);
		// handle error, e.g., show an error message to the user
	}
    // here we send the new username to the backend with a PUT request
    // ofc we need to check that the username is not already taken
  }

  const handleSubmitChangePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmit(true);

	const form = {
		username,
		oldPassword,
		newPassword
	}

	try {
		const response = await settings.changePassword(form);
		//navigate('/success'); // navigate to a success page or show a success message
	} catch (err) {
		console.error(err);
		// handle error, e.g., show an error message to the user
	}
		
    // here we send the new and the old password to the backend with a PUT request
    // check if the old password matches with what stored in the db
    // if it matches update with the new password
  }

  const handleSubmitDeleteAccount = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmit(true);

	const form = {
		username,
		password: oldPassword
	}

	try {
		const response = await settings.deleteAccount(form);
		navigate('/register');
	} catch (err) {
		console.error(err);
		// handle error, e.g., show an error message to the user
	}
    // here we delete the account with a DELETE request
    // check if the password matches with what stored in the db
  }

  const handleChangeUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewUsername(e.target.value);
    setSubmit(false);
    console.log(e.target.value);
  }

  const handleChangeOldPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOldPassword(e.target.value);
    setSubmit(false);
    console.log(e.target.value);
  }

  const handleChangeNewPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassword(e.target.value);
    setSubmit(false);
    console.log(e.target.value);
  }

  return (
    <MainLayout>
      <div className="relative flex flex-col items-center gap-8">
        <div className="sm:absolute sm:left-0">
          <SecondaryButton onClick={() => navigate('/home')}>← Back</SecondaryButton>
        </div>
        <h1 className="text-3xl mb-8">Settings</h1>
        {triggerChangeUsername &&
          <div className="w-80 flex flex-col gap-4">
            <SecondaryButton onClick={reset}>Cancel</SecondaryButton>
            <h2 className="text-2xl mt-8">Change username</h2>
            <form className="flex flex-col" onSubmit={handleSubmitChangeUsername}>
              <Input name="new username" value={newUsername} handler={handleChangeUsername} submit={submit}
                validate={() => newUsername.length > 0} message="Username cannot be empty"/>
              <SubmitButton>Change username</SubmitButton>
            </form>
          </div>
        }
        {triggerChangePassword &&
          <div className="w-80 flex flex-col gap-4">
            <SecondaryButton onClick={reset}>Cancel</SecondaryButton>
            <h2 className="text-2xl mt-8">Change password</h2>
            <form className="flex flex-col" onSubmit={handleSubmitChangePassword}>
              <Input name="old password" value={oldPassword} handler={handleChangeOldPassword}/>
              <Input name="new password" value={newPassword} handler={handleChangeNewPassword} submit={submit}
                validate={() => newPassword.length >= 8} message="Passwords must be at least 8 characters long" />
              <SubmitButton>Change password</SubmitButton>
            </form>
          </div>
        }
        {triggerDeleteAccount &&
          <div className="w-80 flex flex-col gap-4">
            <SecondaryButton onClick={reset}>Cancel</SecondaryButton>
            <h2 className="text-2xl mt-8">Delete account</h2>
            <p>Deleting your account will remove your information from our database. This is not reversible.</p>
            <form className="flex flex-col" onSubmit={handleSubmitDeleteAccount}>
              <Input name="password" value={oldPassword} handler={handleChangeOldPassword} submit={submit} />
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
