import React, { useState, useContext, useRef } from "react";
import { DatePicker } from "material-ui-pickers";
import { MuiPickersContext } from "material-ui-pickers";

export default function DateMultiPicker({
  value,
  onChange,
  labelFunc,
  format,
  emptyLabel,
  onClose,
  ...props
}) {
  const [dates, setDates] = useState(value);
  const utils = useContext(MuiPickersContext);

  function renderDay(day, selectedDate, dayInCurrentMonth, dayComponent) {
    return React.cloneElement(dayComponent, {
      onClick: e => {
        e.stopPropagation();
        const i = dates.findIndex(d => utils.isSameDay(d, day));
        if (i >= 0) {
          const nextDates = [...dates];
          nextDates.splice(i, 1);
          setDates(nextDates);
        } else {
          setDates([...dates, day]);
        }
      },
      selected: !!dates.find(d => utils.isSameDay(d, day))
    });
  }

  const formatDate = date => utils.format(date, format || utils.dateFormat);

  return (
    <DatePicker
      {...props}
      value={dates[0]}
      renderDay={renderDay}
      onClose={() => {
        onChange(dates);
        if (onClose) onClose();
      }}
      onChange={() => {}}
      onClear={() => {
        setDates([]);
        onChange([]);
      }}
      labelFunc={(date, invalid) =>
        labelFunc
          ? labelFunc(dates, invalid)
          : date && dates.length > 0
          ? dates.map(formatDate).join(", ")
          : emptyLabel || ""
      }
    />
  );
}
