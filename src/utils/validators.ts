
// Utility functions for validation



export const validateDate = (date: string): boolean => {

  const parsedDate = Date.parse(date);

  return !isNaN(parsedDate);

};



export const validateLetterNumber = (letterNo: string): boolean => {

  const regex = /^[A-Z]{3}\/[A-Z]{3}\/\d{3}$/;

  return regex.test(letterNo);

};



export const validateRequired = (value: string): boolean => {

  return value.trim().length > 0;

};
