import { ButtonGroup, Button } from '@mui/material';

const QuantityButton = ({ Quantity, handleDecrease, handleIncrease, value }) => {
  return (
    <ButtonGroup variant="outlined" size="small" aria-label="outlined button group">
      <Button name="Decrease" value={value} onClick={handleDecrease}>
        -
      </Button>
      <Button>{Quantity}</Button>
      <Button name="Increase" value={value} onClick={handleIncrease}>
        +
      </Button>
    </ButtonGroup>
  );
};

export default QuantityButton;
