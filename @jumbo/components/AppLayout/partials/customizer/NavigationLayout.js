import React, { useContext } from 'react';
import Box from '@material-ui/core/Box';
import CmtGridView from '../../../../../@coremat/CmtGridView';
import CmtImage from '../../../../../@coremat/CmtImage';
import CmtCard from '../../../../../@coremat/CmtCard';
import CmtCardHeader from '../../../../../@coremat/CmtCard/CmtCardHeader';
import CmtCardContent from '../../../../../@coremat/CmtCard/CmtCardContent';
import { makeStyles } from '@material-ui/core';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import AppContext from '../../../contextProvider/AppContextProvider/AppContext';
import { LAYOUT_OPTIONS } from '../../../../constants/CustomizerOptions';

const useStyles = makeStyles((theme) => ({
  cardRoot: {
    '& .Cmt-header-root': {
      padding: 16,
    },
    '& .Cmt-card-content': {
      paddingLeft: 16,
      paddingRight: 16,
      paddingBottom: 16,
    },
  },
  checkIcon: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    fill: theme.palette.success.main,
  },
}));

const NavigationLayout = () => {
  const classes = useStyles();
  const { layout, setLayout } = useContext(AppContext);

  return (
    <CmtCard className={classes.cardRoot}>
      <CmtCardHeader title="Navigation Layout" />
      <CmtCardContent>
        <CmtGridView
          itemPadding={16}
          data={LAYOUT_OPTIONS}
          renderRow={(item, index) => (
            <Box key={index} className="pointer" onClick={() => setLayout(item.id)}>
              <Box position="relative">
                <CmtImage src={item.image} alt={item.layoutName} />
                {item.id === layout && <CheckCircleIcon className={classes.checkIcon} />}
              </Box>
              <Box mt={2}>{item.layoutName}</Box>
            </Box>
          )}
        />
      </CmtCardContent>
    </CmtCard>
  );
};

export default NavigationLayout;
