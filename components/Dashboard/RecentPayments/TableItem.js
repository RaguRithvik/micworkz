import React, { useState } from 'react';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import CmtObjectSummary from '../../../@coremat/CmtObjectSummary';
import Box from '@material-ui/core/Box';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import { timeFromNow } from '../../../@jumbo/utils/dateHelper';
import makeStyles from '@material-ui/core/styles/makeStyles';
import clsx from 'clsx';
import Button from '@material-ui/core/Button';
import Collapse from '@material-ui/core/Collapse';
import CmtAvatar from '../../../@coremat/CmtAvatar';
import { ArrowUpward } from '@material-ui/icons';
import { fade } from '@material-ui/core';
import LanguageConfig from "../../../helper/LanguageConfig"
import { newConstants } from "../../../helper/constants";

const useStyles = makeStyles((theme) => ({
  tableRowRoot: {
    position: 'relative',
    transition: 'all .2s',
    borderTop: `solid 1px ${theme.palette.borderColor.main}`,
    '&:hover, &.active': {
      backgroundColor: fade(theme.palette.primary.main, 0.08),
      '& $tableCellRoot, & $titleRoot': {
        color: theme.palette.text.primary,
      },
      '& $showContent': {
        width: 0,
      },
      '& $hideContent': {
        transform: 'translateX(0)',
        width: '100%',
      },
    },
    '&:last-child': {
      borderBottom: `solid 1px ${theme.palette.borderColor.main}`,
    },
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: `0 3px 10px 0 ${fade(theme.palette.common.dark, 0.2)}`,
      borderTopColor: 'transparent',
    },
    '&.collapse-table-row': {
      borderTop: '0 none',
      '& $tableCellRoot': {
        padding: 0,
      },
    },
    '&.active': {
      borderTop: '0 none',
      '&:hover': {
        transform: 'none',
        boxShadow: 'none',
      },
    },
  },
  tableCellRoot: {
    padding: 6,
    fontSize: 14,
    letterSpacing: 0.25,
    color: theme.palette.text.secondary,
    borderBottom: '0 none',
    position: 'relative',
    '&:first-child': {
      paddingLeft: 24,
    },
    '&:last-child': {
      textAlign: 'right',
      paddingRight: 24,
    },
  },
  tableCellFirst: {
    width: '50%',
  },
  tableCellSecond: {
    width: '25%',
  },
  tableCellHideShow: {
    width: '25%',
  },
  titleRoot: {
    color: theme.palette.text.secondary,
    letterSpacing: 0.25,
  },
  hideShowContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: '100%',
    overflow: 'hidden',
    position: 'relative',
  },
  showContent: {
    transition: 'all 0.3s ease-in-out',
    width: '100%',
    overflow: 'hidden',
    position: 'absolute',
    right: 0,
  },
  hideContent: {
    transition: 'all 0.3s ease-in-out',
    transform: 'translateX(110%)',
    overflow: 'hidden',
  },
  hideShowLink: {
    cursor: 'pointer',
  },
  collapseTable: {
    paddingLeft: 60,
    '& td': {
      color: theme.palette.text.secondary,
      fontSize: 12,
      letterSpacing: 0.4,
      padding: 0,
      borderBottom: '0 none',
    },
  },
  openDataRot: {
    color: theme.palette.text.secondary,
    fontSize: 12,
    letterSpacing: 0.4,
    paddingLeft: 63,
    textAlign: 'left',
    paddingBottom: 10,
    marginTop: -15,
  },
}));

const TableItem = ({ row }) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  // const fromTodayDateChinese=(val)=>{
  //   return timeFromNow(val).replace("a month ago","1 个月前")
  //   .replace("months ago","个月前").replace("a days ago","1 天前")
  //   .replace("a day ago","1 天前").replace("days ago","天前")
  //   .replace("a year ago","1 一年前").replace("years ago","几年前")
  // }

  return (
    <React.Fragment>
      <TableRow className={clsx(classes.tableRowRoot, open ? 'active' : '')}>
        <TableCell className={clsx(classes.tableCellRoot, classes.tableCellFirst)}>
          <CmtObjectSummary
            avatar={<CmtAvatar src="https://via.placeholder.com/150x150" alt={row[newConstants.INVOICE_PERSON]} />}
            title={row[newConstants.INVOICE_PERSON]}
            titleProps={{ className: classes.titleRoot }}
            showItemBadge={false}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            align={'horizontal'}
          />
        </TableCell>
        <TableCell className={clsx(classes.tableCellRoot, classes.tableCellSecond)}>
          {(row[newConstants.PAYMENT_CURRENCY])}
        </TableCell>
        <TableCell className={clsx(classes.tableCellRoot, classes.tableCellHideShow)} onClick={() => setOpen(!open)}>
          <Box className={classes.hideShowContent}>
            <Box className={classes.showContent}>&yen;{row[newConstants.PAYMENT_AMOUNT]}</Box>
            <Box
              className={clsx(classes.hideContent, classes.hideShowLink)}
              color="primary.main"
              display="flex"
              alignItems="center"
              justifyContent="flex-end">
              <Box component="span" fontWeight={700} mr={2}>
                <LanguageConfig id={open?"dashboardpage.hide":"dashboardpage.detail"}/>
              </Box>
              {open ? <ArrowUpward fontSize="small" /> : <ArrowDownwardIcon fontSize="small" />}
            </Box>
          </Box>
        </TableCell>
      </TableRow>

      <TableRow className={clsx(classes.tableRowRoot, open ? 'active' : 'collapse-table-row')}>
        <TableCell className={classes.tableCellRoot} colSpan={12}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box className={classes.openDataRot}>
              {/* <Box>{row.user.position}</Box> */}
              <Box display="flex" alignItems="center">
                {/* <Box mr={3}>
                  Total{' '}
                  <Box component="span" fontWeight="fontWeightRegular" color="text.primary">
                    Hours: {row.rate}
                  </Box>
                </Box> */}

                <Box mr={3}>
                <LanguageConfig id="dashboardpage.paid" />:{' '}
                  <Box component="span" fontWeight="fontWeightRegular" color="text.primary">
                  &yen;{row.rate}
                  </Box>
                </Box>

                <Box>
                <LanguageConfig id="dashboardpage.pending" />{' '}
                  <Box component="span" fontWeight="fontWeightRegular" color="text.primary">
                  &yen;{0}
                  </Box>
                </Box>
                <Box ml="auto">
                  <Button size="small" variant="contained" color="primary">
                    <LanguageConfig id="dashboardpage.cancel" />
                  </Button>
                </Box>
              </Box>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};

export default TableItem;
