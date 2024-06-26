import React from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import makeStyles from '@material-ui/core/styles/makeStyles';
import LanguageConfig from "../../../helper/LanguageConfig"

const tabs = [
  { id: 2, name: <LanguageConfig id="dashboardpage.earning" />, slug: 'earning' },
  { id: 3, name: <LanguageConfig id="dashboardpage.expenses" />, slug: 'expense' },
];

const useStyles = makeStyles((theme) => ({
  tabsRoot: {
    position: 'relative',
    minHeight: 10,
    '& .MuiTab-root': {
      maxWidth: 'none',
      minWidth: 10,
      fontSize: 10,
      minHeight: 10,
      letterSpacing: 1.5,
    },
  },
}));

const SummaryTabs = ({ tabValue, setTabValue }) => {
  const classes = useStyles();
  const a11yProps = (index) => {
    return {
      id: `scrollable-force-tab-${index}`,
      'aria-controls': `scrollable-force-tabpanel-${index}`,
    };
  };

  return (
    <Box>
      <Tabs
        value={tabValue}
        onChange={(e, newValue) => setTabValue(newValue)}
        indicatorColor="primary"
        textColor="primary"
        aria-label="scrollable auto tabs example"
        className={classes.tabsRoot}>
        {tabs.map((tab, index) => {
          return <Tab key={tab.id} label={tab.name} {...a11yProps(index)} />;
        })}
      </Tabs>
    </Box>
  );
};

export default SummaryTabs;
