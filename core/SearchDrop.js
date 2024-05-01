import React, { useState } from 'react';

import AsyncSelect from 'react-select/async';

const SearchDrop=({value,data,name,onChange,label})=>{   
 
    const customStyles = {
        container: (provided, state) => ({
          ...provided, 
          zIndex:state.isFocused ?1000:""
        }),
        valueContainer: (provided, state) => ({
          ...provided
        }),
        placeholder: (provided, state) => ({
          ...provided, 
          fontWeight:1000 
        }),
        control: (provided, state) => ({
          ...provided,  
          height:57,
          padding:5,  
          borderWidth:1.2,
        //   borderColor:error?'#E34231':"#B2BEB5"  
        }), 
        singleValue: (provided, state) => {
          const opacity = state.isDisabled ? 0.5 : 1;
          const transition = 'opacity 300ms';
      
          return { ...provided, opacity, transition };
        }
      }
      
//   const handleInputChange = (newValue) => {
//     const inputValue = newValue.replace(/\W/g, '');
//     this.setState({ value });
//     return inputValue;
//   };

  const loadOptions = (inputValue, callback) => {
    setTimeout(() => {
      callback(filterData(inputValue));
    }, 1000);
  };

  const filterData = (inputValue) => {    
  return data.filter(i =>
    i.label.toLowerCase().includes(inputValue.toLowerCase())
  );
};

    return (
      <div>     
        <AsyncSelect
          styles={customStyles}
          cacheOptions
          loadOptions={loadOptions}      
          value={value}
          name={name}          
        //   defaultOptions={value ? [value] : []}      
         onInputChange={(e) => onChange({ target: { value: e.value, name: name } })}
        />
      </div>
    );
  }

  export default SearchDrop
