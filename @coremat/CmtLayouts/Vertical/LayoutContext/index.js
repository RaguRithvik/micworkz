import React, { useState } from 'react';
import LayoutContext from './LayoutContext';

const LayoutContextProvider = ({ children }) => {
  const [isOpen, setOpen] = useState(false);
  const [isToggle, setToggle] = useState(false);

  return (
    <LayoutContext.Provider
      value={{
        isOpen,
        setOpen,
        isToggle, 
        setToggle
      }}>
      {children}
    </LayoutContext.Provider>
  );
};

export default LayoutContextProvider;
