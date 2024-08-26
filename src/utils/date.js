export const getFormatDateString = (date) => {
  const formDate = new Date(date);
  formDate.toDateString();
  return `${formDate.getDate()}-${formDate.getMonth() + 1}-${formDate.getFullYear()}`;
}