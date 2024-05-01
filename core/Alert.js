import React from 'react';
import { Button, Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText } from '@material-ui/core';

const Alert = ({ message, open, setOpen, action }) => {
  return (
    <div>
      <Dialog
        open={open}
        onClose={() => setOpen('')}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">{'Confirmation Alert.'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">{message}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen('')} color="primary">
            No
          </Button>
          <Button onClick={action} color="primary" autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Alert;
