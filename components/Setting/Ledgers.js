import React, { useState } from 'react';
import { Text, Card, Row, Column } from "../../core"
import {FormControlLabel ,Checkbox, Fade, InputLabel ,InputBase, TextField, Select, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, MenuItem, FormControl, Divider } from '@material-ui/core';
import { fade, makeStyles, withStyles } from '@material-ui/core/styles';
import { Search, Create, Delete } from '@material-ui/icons';
import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker,
    KeyboardDatePicker,
  } from '@material-ui/pickers';

const BootstrapInput = withStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
      },
    root: {
        'label + &': {
            marginTop: theme.spacing(3),
        },
    },
    input: {
        borderRadius: 4,
        position: 'relative',
        backgroundColor: theme.palette.background.paper,
        border: '1px solid #ced4da',
        fontSize: 16,
        padding: '10px 26px 10px 12px',
        transition: theme.transitions.create(['border-color', 'box-shadow']),
        // Use the system font instead of the default Roboto font.
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),
        '&:focus': {
            borderRadius: 4,
            borderColor: '#80bdff',
            boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
        },
    },
}))(InputBase);

const useStyles = makeStyles((theme) => ({
    table: {
        minWidth: 650,
    },
    saveButton: {
        margin: 5 
    },
    addButton: {
        margin: 5 
    },
    closeButton: {
        margin: 5
    },
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.black, 0.15),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.black, 0.25),
        },
        marginRight: theme.spacing(2),
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(3),
            width: 'auto',
        },
    },
    searchIcon: {
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputRoot: {
        color: 'inherit',
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
        height: 30,
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '30ch',
        },
    },
    tableHead: {
        backgroundColor: '#003399'
    },
    tableHeadTuple: {
        color: '#ffffff'
    },
    actionButton: {
        margin: 3,
        backgroundColor: theme.palette.primary.main,
        minWidth: 50,
      },
      actionButtonDelete: {
        margin: 3,
        backgroundColor: theme.palette.error.main,
        minWidth: 50,
        color: '#fff',
        '&:hover': {
          backgroundColor: theme.palette.error.dark,
        },
      },
    currentPage:{
        paddingLeft:10,
        paddingRight:10
    }
}));

export default function SellingPriceSetUp() {
    const classes = useStyles();
    const [addEdit, setAddEdit] = useState(false)
    return (
        <div>
            <Card noShadow padding={[10]}>
                <Row>
                    {addEdit ?
                        <Column>
                            <Fade in={addEdit}>
                                <Row>
                                    <Column style={{ backgroundColor: '#003399' }} padding={[8]}>
                                        <Text bold size={16} color="white">Ledgers</Text>
                                    </Column>
                                    <Column>
                                        <Row>
                                            <Column md={3} padding={[15, 5]}>
                                            <FormControl variant="outlined" className={classes.formControl}>
                                                <InputLabel id="demo-simple-select-outlined-label">Ledger Group *
                                                </InputLabel>
                                                <Select
                                                    size="small"
                                                    labelId="demo-simple-select-outlined-label"
                                                    id="demo-simple-select-outlined"
                                                    value={10}
                                                    onChange={(v)=>console.log(v)}
                                                    label="Ledgers ()"
                                                 >   Ledger Group *
                                                <MenuItem value="">
                                                    <em>None</em>
                                                </MenuItem>
                                                <MenuItem value={10}>CHOOSE A LEDGER GROUP</MenuItem>
                                                <MenuItem value={20}></MenuItem>
                                                <MenuItem value={30}></MenuItem>
                                                </Select>
                                            </FormControl>
                                            </Column>
                                            <Column md={3} padding={[15, 5]}>
                                                <TextField
                                                    error={false}
                                                    id="outlined-error-helper-text"
                                                    label="Ledger Name *"
                                                    defaultValue=""
                                                    helperText={false ? "Incorrect entry." : ""}
                                                    variant="outlined"
                                                />
                                            </Column> 
                                      
                                            <Column right padding={[10,0]}>
                                                <Row>
                                                    <Column md={8}>
                                                    </Column>

                                                    <Column right md={4}>
                                                        <Row>
                                                            <Button className={classes.saveButton} variant="contained" color="primary">Save</Button>
                                                            <Button className={classes.saveButton} variant="contained" color="secondary">save & Add</Button>
                                                            <Button onClick={() => setAddEdit(false)} className={classes.closeButton} variant="contained">Close</Button>
                                                        </Row>
                                                    </Column>
                                                </Row>
                                            </Column>
                                        </Row>
                                    </Column>
                                </Row>
                            </Fade>
                        </Column> : null}
                    {!addEdit ?
                        <Column right>
                            <Button variant="contained" color="primary" className={classes.addButton} onClick={() => setAddEdit(true)}>Add</Button>
                        </Column> : null}
                    <Column left padding={[5]}>
                        <FormControl className={classes.margin}>
                            <Select
                                labelId="demo-customized-select-label"
                                id="demo-customized-select"
                                value={[""]}
                                onChange={(v) => console.log(v)}
                                multiple={true}
                                label={"Select Column To Hide"}
                                input={<BootstrapInput />}
                            >
                                <MenuItem value={""}>Select Column to Hide</MenuItem>
                                <MenuItem value={10}>Ten</MenuItem>
                                <MenuItem value={20}>Twenty</MenuItem>
                                <MenuItem value={30}>Thirty</MenuItem>
                            </Select>
                        </FormControl>
                    </Column>
                    <Column padding={[5]}>
                        <Row>
                            <Column md={6} xs={6} sm={6}>
                                <Row middle>
                                    <Text size={14} bold style={{ marginRight: 5 }}>Show</Text>
                                    <FormControl className={classes.margin}>
                                        <Select
                                            labelId="demo-customized-select-label"
                                            id="demo-customized-select"
                                            value={10}
                                            onChange={(v) => console.log(v)}
                                            label={"Select Column To Hide"}
                                            input={<BootstrapInput />}
                                        >
                                            <MenuItem value={10}>Ten</MenuItem>
                                            <MenuItem value={20}>Twenty</MenuItem>
                                            <MenuItem value={30}>Thirty</MenuItem>
                                        </Select>
                                    </FormControl>
                                    <Text size={14} medium style={{ marginLeft: 5 }}>Entries</Text>
                                </Row>
                            </Column>
                            <Column md={6} xs={6} sm={6} right>
                                <div className={classes.search}>
                                    <div className={classes.searchIcon}>
                                        <Search />
                                    </div>
                                    <InputBase
                                        placeholder="Search…"
                                        classes={{
                                            root: classes.inputRoot,
                                            input: classes.inputInput,
                                        }}
                                        inputProps={{ 'aria-label': 'search' }}
                                    />
                                </div>

                            </Column>
                        </Row>
                    </Column>
                    <Column padding={[5]}>
                        <TableContainer component={Paper}>
                            <Table className={classes.table} size="small" aria-label="a dense table">
                                <TableHead className={classes.tableHead}>
                                    <TableRow>
                                        <TableCell className={classes.tableHeadTuple}>Dessert (100g serving)</TableCell>
                                        <TableCell className={classes.tableHeadTuple}>Calories</TableCell>
                                        <TableCell className={classes.tableHeadTuple}>Fat&nbsp;(g)</TableCell>
                                        <TableCell className={classes.tableHeadTuple}>Carbs&nbsp;(g)</TableCell>
                                        <TableCell className={classes.tableHeadTuple}>Protein&nbsp;(g)</TableCell>
                                        <TableCell className={classes.tableHeadTuple}>Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {[1, 2, 3].map((row) => (
                                        <TableRow key={row}>
                                            <TableCell scope="row">{row}</TableCell>
                                            <TableCell align="right">{row}</TableCell>
                                            <TableCell align="right">{row}</TableCell>
                                            <TableCell align="right">{row}</TableCell>
                                            <TableCell align="right">{row}</TableCell>
                                            <TableCell >
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    size="small"
                                                    className={classes.actionButton}
                                                    startIcon={<Create />}
                                                >
                                                    Edit
                                                </Button>

                                                <Button
                                                    variant="contained"
                                                    color="default"
                                                    size="small"
                                                    className={classes.actionButtonDelete}
                                                    startIcon={<Delete />}
                                                >
                                                    Delete
                                                    </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Column>
                    <Column>
                       <Row>
                           <Column md={9} xs={7} sm={7}>
                              <Text medium sizs={14}>Showing 1 to 2 of 3 entries</Text>
                           </Column>
                           <Column md={3} xs={5} sm={5}>
                               <Row center middle>
                                   <Button>Previous</Button>
                                   <Text bold size={17} className={classes.currentPage}>1</Text>
                                   <Button>Next</Button>
                               </Row>
                           </Column>
                       </Row>
                    </Column>
                </Row>
            </Card>
        </div>
    )
}
