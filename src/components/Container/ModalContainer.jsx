import { Dialog, DialogTitle, DialogActions, DialogContent, IconButton, Box } from '@mui/material';
import { ControlButton } from '../Controls';
import CloseIcon from '@mui/icons-material/Close';
const ModalContainer = ({ title, open, onClose, children }) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth={true} maxWidth="md">
      <DialogTitle
        sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
      >
        {title}
        {/* <Box width="90%">{title}</Box> */}
        {/* <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            color: 'grey',
          }}
        >
          <CloseIcon sx={{ fontSize: '3rem' }} />
        </IconButton> */}
      </DialogTitle>
      <DialogContent dividers>{children}</DialogContent>
      <DialogActions>
        <ControlButton
          onClick={onClose}
          width="120px"
          height="35px"
          margin="0 12px 12px 0"
          variant="text"
          fontSize="1.4rem"
        >
          Đóng
        </ControlButton>
      </DialogActions>
    </Dialog>
  );
};

export default ModalContainer;
