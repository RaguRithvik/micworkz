import React, { useState, useMemo } from 'react';
import { httpPostRequest } from '../helper/JsHelper';
import { makeStyles } from '@material-ui/core/styles';
import { TextField, ListItemIcon, MenuItem, Typography } from '@material-ui/core'
import { constants, newConstants } from '../helper/constants';
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import TreeItem from '@material-ui/lab/TreeItem';
import PropTypes from 'prop-types';
import {Text,Loader} from '../core';

const useStyles = makeStyles((theme) => ({
  root: {
    // height: 216,
    flexGrow: 1,
    maxWidth: 400,
  },
  rooting: {
    color: theme.palette.text.secondary,
    '&:hover > $content': {
      backgroundColor: theme.palette.action.hover,
    },
    '&:focus > $content, &$selected > $content': {
      backgroundColor: `var(--tree-view-bg-color, ${theme.palette.grey[400]})`,
      color: 'var(--tree-view-color)',
    },
    '&:focus > $content $label, &:hover > $content $label, &$selected > $content $label': {
      backgroundColor: 'transparent',
    },
  },
  content: {
    color: theme.palette.text.secondary,
    borderTopRightRadius: theme.spacing(2),
    borderBottomRightRadius: theme.spacing(2),
    paddingRight: theme.spacing(1),
    fontWeight: theme.typography.fontWeightMedium,
    '$expanded > &': {
      fontWeight: theme.typography.fontWeightRegular,
    },
  },
  group: {
    marginLeft: 0,
    '& $content': {
      paddingLeft: theme.spacing(2),
    },
  },
  expanded: {},
  selected: {},
  label: {
    fontWeight: 'inherit',
    color: 'inherit',
  },
  labelRoot: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0.5, 0),
  },
  labelIcon: {
    marginRight: theme.spacing(1),
  },
  labelText: {
    fontWeight: 'inherit',
    flexGrow: 1,
  },
}));


function StyledTreeItem(props) {
  const classes = useStyles();
  const { labelText, labelIcon: LabelIcon, color, bgColor, ...other } = props;

  return (
    <TreeItem
      label={
        <div className={classes.labelRoot}>
          <LabelIcon color="inherit" className={classes.labelIcon} />
          <Typography variant="body2" className={classes.labelText}>
            {labelText}
          </Typography>
        </div>
      }
      style={{
        '--tree-view-color': color,
        '--tree-view-bg-color': bgColor,
      }}
      classes={{
        root: classes.rooting,
        content: classes.content,
        expanded: classes.expanded,
        selected: classes.selected,
        group: classes.group,
        label: classes.label,
      }}
      {...other}
    />
  );
}

StyledTreeItem.propTypes = {
  bgColor: PropTypes.string,
  color: PropTypes.string,
  labelIcon: PropTypes.elementType.isRequired,
  labelInfo: PropTypes.string,
  labelText: PropTypes.string.isRequired,
};

export default function TreeViewSelect({
  name,
  onChange,
  groupGetFunction,
  groupName = '',
  groupKey = '',
  groupChild = '',
}) {
  const classes = useStyles();
  const [expanded, setExpanded] = useState([]);
  const [selected, setSelected] = useState([]);
  const [data, setData] = useState([]);
  const [treeLoader, setTreeloader] = useState(false)
  const recursiveCall = (childArray) => {
    if (childArray.length) {
      return childArray.map((v) => ({
        label: v[groupName],
        key: v[groupKey],
        nodes: recursiveCall(v[groupChild]),
      }));
    } else {
      return [];
    }
  };
  const getParents = async () => {
    setTreeloader(true)
    let res = await httpPostRequest(groupGetFunction());
    if (res && res[constants.DATA_EXCEPTION] && res[constants.DATA_EXCEPTION][constants.ERR_CODE] == 200) {
      setTreeloader(false)
      let treeView_ = res[constants.DATA].map((value) => {
        return {
          label: value[groupName],
          key: value[groupKey],
          nodes: recursiveCall(value[groupChild]),
        };
      });
      setData(treeView_);
    }
  };

  useMemo(() => {
    getParents();
  }, []);

  const handleToggle = (event, nodeIds) => {
    setExpanded(nodeIds);
  };


  const handleSelect = (event, nodeIds) => {
    setSelected(nodeIds);
    onChange({ target: { value: nodeIds, name: name } });
  };



  const renderTree = (nodes) => (
    <StyledTreeItem nodeId={nodes.key} labelText={nodes.label} labelIcon={SupervisorAccountIcon}>
      {Array.isArray(nodes.nodes) ? nodes.nodes.map((node) => renderTree(node)) : null}
    </StyledTreeItem>
  );

  return (
    <div>
      <Text variant={"h6"} size={25} bold>Ledger Groups</Text>
      {treeLoader ? <Loader size={20} color={'blue'} /> :
        <TreeView
          className={classes.root}
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpandIcon={<ChevronRightIcon />}
          expanded={expanded}
          selected={selected}
          defaultExpanded={['root']}
          onNodeToggle={handleToggle}
          onNodeSelect={handleSelect}
        >
          {data.map((data, index) => (
            renderTree(data)
          ))}
        </TreeView>}
    </div>
  );
}
