export const emailValidator = (email: string) => {
  const re = /\S+@\S+\.\S+/;

  if (!email || email.length <= 0) return 'Email cannot be empty.';
  if (!re.test(email)) return 'Ooops! We need a valid email address.';

  return '';
};

export const passwordValidator = (password: string) => {
  if (!password || password.length <= 0) return 'Password cannot be empty.';
  if (password.length < 8) return 'Password must be at least 8 digits.';

  return '';
};

export const confirmPasswordValidator = (confirm_password: string, password: string) => {
  if (!confirm_password || confirm_password.length <= 0) return 'Confirm password cannot be empty.';
  if (confirm_password !== password) return "Password didn't match.";

  return '';
};

export const firstNameValidator = (first_name: string) => {
  if (!first_name || first_name.length <= 0) return 'First name cannot be empty.';

  return '';
};

export const lastNameValidator = (last_name: string) => {
  if (!last_name || last_name.length <= 0) return 'Last name cannot be empty.';

  return '';
};

export const phoneValidator = (phone: string) => {
  if (!phone || phone.length <= 0) return 'Mobile number cannot be empty.';

  return '';
};

export const accountNumberError = (account_number: string) => {
  if (!account_number || account_number.length <= 0) return 'Card number cannot be empty.';

  return '';
};

export const cardCvnError = (card_cvn: string) => {
  if (!card_cvn || card_cvn.length <= 0) return 'CVV cannot be empty.';

  return '';
};

export const expiryDateError = (expiry_date: string) => {
  if (!expiry_date || expiry_date.length <= 0) return 'Expiry date cannot be empty.';

  return '';
};
