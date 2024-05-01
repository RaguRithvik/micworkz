import React, { useContext } from 'react';
import CmtCard from '../../../../../@coremat/CmtCard';
import CmtCardHeader from '../../../../../@coremat/CmtCard/CmtCardHeader';
import CmtCardContent from '../../../../../@coremat/CmtCard/CmtCardContent';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core';
import AppRadioButton from '../../../Common/formElements/AppRadioButton';
import AppContext from '../../../contextProvider/AppContextProvider/AppContext';
import { SIDEBAR_WIDTH } from '../../../../constants/ThemeOptions';

const useStyles = makeStyles((theme) => ({
  cardRoot: {
    '& .Cmt-header-root': {
      padding: '4px 16px',
    },
    '& .Cmt-card-content': {
      paddingLeft: 16,
      paddingRight: 16,
      paddingBottom: 16,
    },
  },
}));

const sizes = [
  { label: 'Small', value: SIDEBAR_WIDTH.SMALL },
  { label: 'Default', value: SIDEBAR_WIDTH.DEFAULT },
  { label: 'Wide', value: SIDEBAR_WIDTH.WIDE },
];

const SidebarSize = () => {
  const classes = useStyles();
  const { sidebarSize, setSidebarSize } = useContext(AppContext);

  const onResetSize = () => {
    setSidebarSize('default');
  };

  return (
    <CmtCard className={classes.cardRoot}>
      <CmtCardHeader title="Sidebar size">
        <Button onClick={onResetSize}>RESET</Button>
      </CmtCardHeader>
      <CmtCardContent>
        {sizes.map((item, index) => (
          <AppRadioButton
            key={index}
            name="size-style"
            label={item.label}
            value={item.value}
            checked={sidebarSize === item.value}
            onChange={() => setSidebarSize(item.value)}
          />
        ))}
      </CmtCardContent>
    </CmtCard>
  );
};

export default SidebarSize;
