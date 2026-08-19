export const getHeaderWithToken = () => {
  const token = window.localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
}
