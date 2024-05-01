import React, { useState } from 'react';
import Select from 'react-select';

const SelectC = ({ placeholder, error, helperText, name, value, options, onChange, ...props }) => {
  const [focus, setFocus] = useState(value ? true : false);
  const customStyles = {
    container: (provided, state) => ({
      ...provided,
      zIndex: state.isFocused ? 1000 : '',
    }),
    valueContainer: (provided, state) => ({
      ...provided,
    }),
    placeholder: (provided, state) => ({
      ...provided,
      fontWeight: 1000,
    }),
    control: (provided, state) => ({
      ...provided,
      minHeight: 55,
      height: 'auto',
      padding: 5,
      borderWidth: 1.2,
      borderColor: error ? '#E34231' : '#B2BEB5',
    }),
    singleValue: (provided, state) => {
      const opacity = state.isDisabled ? 0.5 : 1;
      const transition = 'opacity 300ms';

      return { ...provided, opacity, transition };
    },
  };

  return (
    <div>
      <Select
        defaultValue={value}
        styles={customStyles}
        cacheOptions
        value={value}
        placeholder={''}
        isMulti
        name={name}
        options={options}
        onChange={onChange}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(value ? true : false)}
        className="basic-multi-select"
        classNamePrefix="select"
        {...props}
      />
      <p
        onClick={() => setFocus(true)}
        style={{
          position: 'absolute',
          paddingLeft: 4,
          paddingRight: 4,
          marginLeft: 11,
          backgroundColor: 'white',
          color: '#003399',
          fontSize: focus || value ? 12 : 16,
          opacity: focus || value ? 1 : 0.78,
          zIndex: 2000,
          transitionDuration: '.2s',
          transform: 'translate(0,' + (focus || value ? '-66px' : '-40px') + ') scale(1)',
        }}>
        {placeholder}
      </p>
      {error ? <span style={{ color: '#E34231', fontSize: 12, marginLeft: 15 }}>{helperText}</span> : null}
    </div>
  );
};

export default SelectC;
