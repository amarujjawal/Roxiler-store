export const passwordRegex = /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/;
export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateName = (name) =>
  typeof name === "string" &&
  name.trim().length >= 6 &&
  name.trim().length <= 60;

export const validateAddress = (address) =>
  typeof address === "string" &&
  address.trim().length >= 1 &&
  address.trim().length <= 400;

export const validateRequiredString = (value, maxLength) =>
  typeof value === "string" &&
  value.trim().length >= 1 &&
  value.trim().length <= maxLength;
