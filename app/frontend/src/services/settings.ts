import axios from 'axios'

interface ChangeUsernameForm {
  newUsername: string;
}

interface ChangePasswordForm {
  oldPassword: string;
  newPassword: string;
}

interface DeleteAccountForm {
  password: string;
}

const changeUsername = (form: ChangeUsernameForm) => {
  const url = "/v1/settings/username";
  return axios.post(url, form);
}

const changePassword = (form: ChangePasswordForm) => {
  const url = "/v1/settings/password";
  return axios.post(url, form);
}

const deleteAccount = (form: DeleteAccountForm) => {
  const url = "/v1/settings/delete";

  return axios.delete(url, {
    data: form,
  });
};

export default { changeUsername, changePassword, deleteAccount }