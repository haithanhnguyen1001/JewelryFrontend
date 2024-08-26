export const resetForm = (dispatch, defaultFormFields) => {
  dispatch({
    type: "reset_form",
    payload: {
      defaultFormFields,
    },
  });
};

export const handleChange = (dispatch, event, type="text") => {
  let { name, value } = event.target;
  if (type === "number") value = Number(value);
  dispatch({
    type: "input_change",
    payload: {
      name: name,
      value: value,
    },
  });
};


export const handleAddService = (dispatch, event, services, state) => {
  const toAddService = services[event.target.value];
  dispatch({
    type: "add_service",
    payload: {
      toAddService,
    },
  });
}

export const handleRemove = (dispatch, event, state, type) => {
  dispatch({
    type: "remove_product",
    payload: {
      index: event.target.value,
      formType: type
    },
  });
};

export const handleRemoveService = (dispatch, event, state) => {
  dispatch({
    type: "remove_service",
    payload: {
      index: event.target.value,
    },
  });
};

export const handleDecrease = (dispatch, event, state, type) => {
  dispatch({
    type: "decrease",
    payload: {
      index: event.target.value,
      formType: type
    },
  });
};

export const handleDecreaseService = (dispatch, event, state) => {
  dispatch({
    type: "decrease_service",
    payload: {
      index: event.target.value,
    },
  });
};

export const handleIncrease = (dispatch, event, state,type) => {
  dispatch({
    type: "increase",
    payload: {
      index: event.target.value,
      formType: type
    },
  });
};

export const handleIncreaseService = (dispatch, event, state) => {
  dispatch({
    type: "increase_service",
    payload: {
      index: event.target.value,
    },
  });
};
