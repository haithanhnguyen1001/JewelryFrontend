export const countQuantity = (forms, id, month, year) => {
  if (forms === 'No buyform found' || forms === 'No sales found') return 'Empty';

  let totalQuantity = 0;
  const date = new Date(year, month - 1);
  // Filter form by month, year
  const filteredForms = forms.filter((form) => {
    const formDate = new Date(form.date);
    return ((formDate.getMonth() + 1) === month && formDate.getFullYear() === year);
  });


  // FilteredForm is empty
  if (filteredForms.length !== 0)
    if (filteredForms[0].SellFormDetails !== undefined)
      // Check if it's sell form
      for (const form of filteredForms) {
        for (const product of form.SellFormDetails) {
          if (product.ProductId === id) {
            totalQuantity += product.quantity;
          }
        }
      }
    else
      for (const form of filteredForms) {
        for (const product of form.BuyFormDetails) {
          if (product.ProductId === id) {
            totalQuantity += product.quantity;
          }
        }
      }
  // if (totalQuantity < 0) {
  //   return 0;
  // }
  return totalQuantity;
};