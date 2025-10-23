// export const isAuthenticated = () => {
//   return !!localStorage.getItem('token');
// };



export const isAuthenticated = () => {
  return !!localStorage.getItem('user');
};

export const getUserRole = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user?.role;
};

export const loginUser = (username, role) => {
  localStorage.setItem('user', JSON.stringify({ username, role }));
};

export const logoutUser = () => {
  localStorage.removeItem('user');
};
