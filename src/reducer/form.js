const formReducer = (state, action) => {
  let updatedCart = (state.cart || state.serviceCart).slice();
  const type = action.payload.formType;

  const getBuySubtotal = (product) => {
    return product.quantity * product.price;
  };
  const getServiceSubtotal = (service) => {
    return service.quantity * (service.price + service.incurred) - service.prePaid;
  }

  switch (action.type) {
    case "reset_form":
      return { ...action.payload.defaultFormFields };

    case "input_change":
      return { ...state, [action.payload.name]: action.payload.value };

    case "add_product":
      let foundIndex = updatedCart.findIndex(
        (product) => product.id === action.payload.toAddProduct.id
      );
      if (foundIndex !== -1) {
        updatedCart = state.cart.map((product, index) => {
          if (index === foundIndex) {
            return {
              ...product,
              quantity: product.quantity + 1,
            };
          }
          return product;
        });
      } else {
        updatedCart = [
          ...state.cart,
          { ...action.payload.toAddProduct, quantity: 1 },
        ];
      }
      return {
        ...state,
        cart: updatedCart,
        total: updatedCart.reduce((totalP, product) => {
          if (type === "buyform") {
            return totalP + getBuySubtotal(product);
          } else {
            return (
              totalP +
              product.quantity *
                product.price *
                (1 + product.ProductType.interest / 100)
            );
          }
        }, 0),
      };

    case "remove_product":
      updatedCart = updatedCart.filter(
        (product, index) => index !== Number(action.payload.index)
      );
      return {
        ...state,
        cart: updatedCart,
        total: updatedCart.reduce((totalP, product) => {
          if (type === "buyform") {
            return totalP + getBuySubtotal(product);
          } else {
            return (
              totalP +
              product.quantity *
                product.price *
                (1 + product.ProductType.interest / 100)
            );
          }
        }, 0),
      };

    case "decrease":
      const decIndex = Number(action.payload.index);
      if (state.cart[decIndex].quantity === 1) {
        updatedCart = state.cart.filter((product, index) => index !== decIndex);
      } else {
        updatedCart = state.cart.map((product, index) => {
          if (index === decIndex) {
            return { ...product, quantity: product.quantity - 1 };
          } else {
            return product;
          }
        });
      }
      return {
        ...state,
        cart: updatedCart,
        total: updatedCart.reduce((totalP, product) => {
          if (type === "buyform") {
            return totalP + getBuySubtotal(product);
          } else {
            return (
              totalP +
              product.quantity *
                product.price *
                (1 + product.ProductType.interest / 100)
            );
          }
        }, 0),
      };

    case "increase":
      const incIndex = Number(action.payload.index);
      updatedCart = state.cart.map((product, index) => {
        if (index === incIndex) {
          return { ...product, quantity: product.quantity + 1 };
        } else {
          return product;
        }
      });
      return {
        ...state,
        cart: updatedCart,
        total: updatedCart.reduce((totalP, product) => {
          if (type === "buyform") {
            return totalP + getBuySubtotal(product);
          } else {
            return (
              totalP +
              product.quantity *
                product.price *
                (1 + product.ProductType.interest / 100)
            );
          }
        }, 0),
      };

    // Supplier buy form
    case "supplier_pick":
      const newSupplier = action.payload.supplier
      return {
        ...state,
        ...newSupplier
      }

    // Services actions =================================

    case "add_service":
      let serviceIdx = updatedCart.findIndex(
        (service) => service.id === action.payload.toAddService.id
      );
      if (serviceIdx !== -1) {
        updatedCart = state.serviceCart.map((service, index) => {
          if (index === serviceIdx) {
            const newItem = {
              ...service,
              quantity: service.quantity + 1,
            }
            return {
              ...service,
              ...newItem,
              subtotal:
                getServiceSubtotal(newItem),
            };
          }
          return service;
        });
      } else {
        updatedCart = [
          ...state.serviceCart,
          {
            ...action.payload.toAddService,
            quantity: 1,
            subtotal:
              action.payload.toAddService.price,
            prePaid: 0,
            incurred: 0,
          },
        ];
      }
      return {
        ...state,
        serviceCart: updatedCart,
        total: updatedCart.reduce(
          (totalP, service) => totalP + getServiceSubtotal(service),
          0
        ),
      };
    case "remove_service":
      updatedCart = updatedCart.filter(
        (service, index) => index !== Number(action.payload.index)
      );
      return {
        ...state,
        serviceCart: updatedCart,
        total: updatedCart.reduce(
          (totalP, service) => totalP + getServiceSubtotal(service),
          0
        ),
      };
    case "decrease_service":
      const serviceDecIdx = Number(action.payload.index);
      if (state.serviceCart[serviceDecIdx].quantity === 1) {
        updatedCart = state.serviceCart.filter(
          (service, index) => index !== serviceDecIdx
        );
      } else {
        updatedCart = state.serviceCart.map((service, index) => {
          if (index === serviceDecIdx) {
            const newItem = {
              ...service,
              quantity: service.quantity - 1,
            }
            return {
              ...service,
              ...newItem,
              subtotal:
                getServiceSubtotal(newItem),
            };
          } else {
            return service;
          }
        });
      }
      return {
        ...state,
        serviceCart: updatedCart,
        total: updatedCart.reduce(
          (totalP, service) => totalP + getServiceSubtotal(service),
          0
        ),
      };

    case "increase_service":
      const serviceIncIdx = Number(action.payload.index);
      updatedCart = state.serviceCart.map((service, index) => {
        if (index === serviceIncIdx) {
          const newItem = {
            ...service,
            quantity: service.quantity + 1,
          }
          return {
            ...service,
            ...newItem,
            subtotal:
              getServiceSubtotal(newItem),
          };
        } else {
          return service;
        }
      });
      return {
        ...state,
        serviceCart: updatedCart,
        total: updatedCart.reduce(
          (totalP, service) => totalP + getServiceSubtotal(service),
          0
        ),
      };

    case "set_pre_paid_service":
      const para = action.payload.para;
      updatedCart = state.serviceCart.map((service, index) => {
        if (service.id === action.payload.id) {
          const incomingPrePaid = action.payload.value;
          // if (incomingPrePaid < ((getServiceSubtotal(service) + service.prePaid) * para / 100) || incomingPrePaid > service.subtotal) {
          //   return {
          //     ...service
          //   }
          // }
          return { 
            ...service, 
            prePaid: incomingPrePaid,
            subtotal: service.quantity * (service.price + service.incurred) - incomingPrePaid,
          };
        }
        else {
          return {
            ...service,
          }
        }
      });
      return {
        ...state,
        serviceCart: updatedCart,
        total: updatedCart.reduce(
          (totalP, service) => totalP + getServiceSubtotal(service),
          0
        ),
      };
    
    case 'set_incurred_service':
      updatedCart = state.serviceCart.map((service, index) => {
        if (service.id === action.payload.id) {
          const incomingIncurred = action.payload.value;
          return {
            ...service,
            incurred: incomingIncurred,
            subtotal: service.quantity * (service.price + incomingIncurred) - service.prePaid,
          }
        }
        else {
          return {
            ...service,
          }
        }
      });
      return {
        ...state,
        serviceCart: updatedCart,
        total: updatedCart.reduce(
          (totalP, service) => totalP + getServiceSubtotal(service),
          0
        ),
      };


    case "remain_calc":
      return {
        ...state,
        remain: action.payload.newRemain,
      };

    default:
      return state;
  }
};

export default formReducer;

export const isPhoneNumber = (number) => {
  if (number.length > 12 || number.length < 10) return false;
  return /^\d+$/.test(number);
}

export const isNumberOnly = (number) => {
  return /^\d+$/.test(number);
}