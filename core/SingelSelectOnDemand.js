import React, { useState, useRef } from 'react';
import AsyncSelect from 'react-select/async';

const SingelSelectOnDemand = ({
  isMulti,
  placeholder,
  error,
  helperText,
  defaultOptions,
  loadOptions,
  onInputChange,
  onChange,
  value,
  myref,
  keyPressed,
  ...props
}) => {
  const [focus, setFocus] = useState(false);
  // const ref = useRef();
  const customStyles = {
    container: (provided, state) => ({
      ...provided,
      zIndex: state.isFocused ? 10 : '',
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
      // height: isMulti ? '' : 57,
      padding: 5,
      borderWidth: 1.2,
      borderColor: error ? '#E34231' : '#B2BEB5',
      height:43,
      fontWeight:600,
      backgroundColor:"white",
    }),
    singleValue: (provided, state) => {
      const opacity = state.isDisabled ? 0.5 : 1;
      const transition = 'opacity 300ms';
      const overflow = 'visible';
      return { ...provided, opacity, transition, overflow };
    },
  };
  
  return (
    <div style={{ position: 'relative' }}>
      <AsyncSelect
        styles={customStyles}
        cacheOptions
        value={value}
        placeholder={isMulti ? placeholder : ''}
        loadOptions={loadOptions}
        defaultOptions={defaultOptions}
        onInputChange={onInputChange}
        onChange={onChange}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        ref={myref}
        onKeyDown={keyPressed}
        isMulti={isMulti}
        {...props}
      />
      {!isMulti && (
        <p
          // onClick={() => ref.current.focus()}
          style={{
            position: 'absolute',
            paddingTop: 11,
            paddingLeft: 4,
            paddingRight: 4,
            marginLeft: 11,
            backgroundColor: 'white',
            fontWeight:focus || value ? 600 : 500,
            color: error ? '#E34231' : focus||value?'#6896c2':"black",
            fontSize: focus || value ? 12 : 14,
            opacity: focus || value || error ? 1 : "",
            zIndex: focus ? 11 : 0,
            transitionDuration: '.2s',
            transform: 'translate(0,' + (focus || value ? '-60px' : '-42px') + ') scale(1)',
          }}>
          {placeholder}
        </p>
      )}
      {error ? <span style={{ color: '#E34231', fontSize: 12, marginLeft: 15 }}>{helperText}</span> : null}
    </div>
  );
};

export default SingelSelectOnDemand;
