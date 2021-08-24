export const isEmail = (email) => (
  email.includes('@')
);

export const stringsMatch = (strOne, strTwo) => (
  strOne === strTwo
);

export const stringContains = (targetStr, valueArr) => (
  pattern.some(value => {
    targetStr.includes(value);
  })
);

export const isValidPassword = (password) => {
  const requiredChars = ['@', '#'];
  return stringContains(password, requiredChars);
};
