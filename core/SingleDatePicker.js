import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import { DatePicker } from '@material-ui/pickers';
import { getDateddMMyyyy } from '../helper/JsHelper';
// import DateFnsUtils from '@date-io/date-fns';
// import { MuiPickersUtilsProvider } from '@material-ui/pickers';

/**
 * TextField Can be directly used with browser native date picker
 * should be implemented as <TextField type="date" InputLabelProps={{shrink:true}} {...other props}/>
 *
 * For Data Intensive and Critical pages used TextFields instead
 */

export default function SingleDatePicker({ label, value, name, setNewDate, minDate, formatString, ...props }) {
  const formateDate = (date) => {
    return getDateddMMyyyy(date);
  };
  const handleDateState = (e) => {
    // event mock for stateUpdater with moment js
    console.log(e);
    setNewDate({
      target: {
        value: new Date(e._d),
        name: name,
      },
    });
  };
  // datefns giving format container latin "n" issue
  return (
    // <MuiPickersUtilsProvider utils={DateFnsUtils}>
    <DatePicker
      label={label}
      value={value ? formateDate(value) : formateDate(new Date())}
      variant="inline"
      inputVariant="outlined"
      allowKeyboardControl={true}
      onChange={handleDateState}
      format="DD/MM/yyyy"
      renderInput={(props) => <TextField {...props} />}
      {...props}
    />
    // </MuiPickersUtilsProvider>
  );
}
