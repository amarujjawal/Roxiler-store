export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateName = (value) => {
  const text = String(value || '').trim();
  return text.length >= 6 && text.length <= 60;
};

export const validateAddress = (value) => {
  const text = String(value || '').trim();
  return text.length > 0 && text.length <= 400;
};

export const validatePassword = (value) => {
  const text = String(value || '');
  return text.length >= 8 && text.length <= 16 && /[A-Z]/.test(text) && /[^A-Za-z0-9]/.test(text);
};

export const validateEmail = (value) => emailRegex.test(String(value || '').trim());

export const validateRating = (value) => {
  const rating = Number(value);
  return Number.isFinite(rating) && rating >= 1 && rating <= 5;
};
