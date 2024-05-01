import React from "react"; 

import {
  MuiPickersUtilsProvider,
  TimePicker,
  DatePicker
} from "material-ui-pickers";
import DateFnsUtils from "@date-io/date-fns";

import { Dialog, DialogContent } from "@material-ui/core";
import { InlineDatePicker } from "material-ui-pickers";
import { isSameDay } from "date-fns";

import DateRangePicker from "./DateRangePicker";
import DateMultiPicker from "./DateMultiPicker"; 

function App() {
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <div className="App">
        <h1>Hello CodeSandbox</h1>
        <h2>Start editing to see some magic happen!</h2>
        <Dialog open>
          <DialogContent>
            {/* <DateRangePicker
              onlyCalendar
              pickerComponent={InlineDatePicker}
              shouldDisableDate={day => isSameDay(day, new Date("2020-08-20"))}
              minDate={new Date("2020-08-05")}
              value={[new Date("2020-08-18"), new Date("2020-08-18")]}
            /> */}
            <DateMultiPicker
              value={[new Date("2014-08-18"), new Date("2014-08-18")]}
            />
          </DialogContent>
        </Dialog>
      </div>
    </MuiPickersUtilsProvider>
  );
}


export default App;