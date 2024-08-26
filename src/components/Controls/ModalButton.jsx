import ControlButton from './ControlButton';
import { ModalContainer } from '../Container';

const ModalButton = ({ buttonName, variant, startIcon, endIcon, color, open, onClick, onClose, title, children }) => {
  return (
    <>
      <ControlButton
        onClick={onClick}
        variant={variant || 'outlined'}
        color={color || 'primary'}
        startIcon={startIcon}
        endIcon={endIcon}
        fontSize="1.1rem"
      >
        {buttonName}
      </ControlButton>
      <ModalContainer title={title} open={open} onClose={onClose}>
        {children}
      </ModalContainer>
    </>
  );
};

export default ModalButton;
