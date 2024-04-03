export const fetchUser = () => {
  const userInfo = localStorage.getItem('user');
  return userInfo !== null && userInfo !== 'undefined'
    ? JSON.parse(userInfo)
    : undefined;
};
