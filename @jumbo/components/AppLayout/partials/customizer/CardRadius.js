import React, { useCallback, useContext, useState } from 'react';
import CmtCardHeader from '../../../../../@coremat/CmtCard/CmtCardHeader';
import Button from '@material-ui/core/Button';
import CmtAdvCardContent from '../../../../../@coremat/CmtAdvCard/CmtAdvCardContent';
import { Box, makeStyles } from '@material-ui/core';
import CmtCard from '../../../../../@coremat/CmtCard';
import AppSlider from '../../../Common/formElements/AppSlider';
import AppContext from '../../../contextProvider/AppContextProvider/AppContext';
import _ from 'lodash';

const useStyles = makeStyles((theme) => ({
  root: {
    width: 250,
  },
  cardRoot: {
    '& .Cmt-header-root': {
      padding: '4px 16px',
    },
    '& .Cmt-card-content': {
      padding: 16,
    },
  },
}));

const CardRadius = () => {
  const classes = useStyles();
  const { cardRadius, updateCardRadius } = useContext(AppContext);
  const [radius, setRadius] = useState(cardRadius);

  const delayedQuery = useCallback(
    _.debounce((newValue) => {
      updateCardRadius(newValue);
    }, 1000),
    [],
  );

  const handleChange = (event, newValue) => {
    setRadius(newValue);
    delayedQuery(newValue);
  };

  const resetRadius = () => {
    setRadius(4);
    updateCardRadius(4);
    delayedQuery(4);
  };

  return (
    <CmtCard className={classes.cardRoot}>
      <CmtCardHeader title="Card Radius">
        <Button onClick={resetRadius}>RESET</Button>
      </CmtCardHeader>
      <CmtAdvCardContent>
        <Box display="flex" alignItems="center" justifyContent="center" mb={6}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            border={1}
            borderColor="grey.300"
            borderRadius={radius}
            bgcolor="background.paper"
            p={2}
            height={63}
            width={154}>
            Preview
          </Box>
        </Box>
        <Box display="flex" alignItems="center">
          <Box mr={6}>4px</Box>
          <AppSlider
            valueLabelDisplay="auto"
            aria-label="card radius"
            defaultValue={4}
            max={16}
            min={4}
            onChange={handleChange}
            value={radius}
          />
          <Box ml={6}>16px</Box>
        </Box>
      </CmtAdvCardContent>
    </CmtCard>
  );
};

export default CardRadius;
