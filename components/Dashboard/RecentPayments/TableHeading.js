import React from 'react';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import makeStyles from '@material-ui/core/styles/makeStyles';
import LanguageConfig from "../../../helper/LanguageConfig"

const useStyles = makeStyles((theme) => ({
  tableCellRoot: {
    paddingLeft: 6,
    paddingRight: 6,
    paddingTop: 0,
    paddingBottom: 12,
    fontSize: 12,
    letterSpacing: 0.4,
    color: theme.palette.common.dark,
    fontWeight: theme.typography.fontWeightRegular,
    borderBottom: '0 none',
    '&:first-child': {
      paddingLeft: 24,
    },
    '&:last-child': {
      textAlign: 'right',
      paddingRight: 24,
    },
  },
}));

const TableHeading = () => {
  const classes = useStyles();
  return (
    <TableRow>
      <TableCell className={classes.tableCellRoot}><LanguageConfig id="dashboardpage.accountholder" /></TableCell>
      <TableCell className={classes.tableCellRoot}><LanguageConfig id="dashboardpage.lasttransfer" /></TableCell>
      <TableCell className={classes.tableCellRoot}><LanguageConfig id="dashboardpage.payment" /></TableCell>
    </TableRow>
  );
};

export default TableHeading;
