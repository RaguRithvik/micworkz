import React,{useState} from 'react';
import { Text,Card, Row, Column,TextArea } from "../../core"
import {Fade ,InputLabel ,InputBase,TextField ,Select, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,Paper,MenuItem,FormControl } from '@material-ui/core';
import { fade,makeStyles,withStyles} from '@material-ui/core/styles'; 
import { Search,Create,Delete } from '@material-ui/icons';  


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

const useStyles = makeStyles((theme)=>({
    table: {
        minWidth: 650,
    },
    saveButton:{
        margin:5 
    },
    addButton:{
        margin:5 
    },
    closeButton:{
        margin:5
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
        height:30,
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
          width: '30ch',
        },
      },
      tableHead:{
        backgroundColor:'#003399'
      },
      tableHeadTuple:{
          color:'#ffffff'
      },
      actionButton:{
          margin:3 
      },
      actionButtonDelete:{
          margin:3 
      },
      searchCol: {
        alignContent: "flex-end", 
        [theme.breakpoints.down('xs')]: {
          alignContent: "end",
          padding: 6
        },
      },
}));

export default function Setup() {
    const classes = useStyles();
    const [addEdit,setAddEdit] = useState(false)
    return (
        <div>
            <Card noShadow padding={[10]}>
                <Row> 
                    {addEdit?
                    <Column>
                        <Fade in={addEdit}>
                        <Row>
                            <Column style={{backgroundColor:'#003399'}} padding={[8]}>
                                <Text bold size={16} color="white">Items / Package</Text>
                            </Column>
                            <Column>
                                <Row>
                                    <Column md={3} padding={[10,5]}>
                                    
                                    <FormControl variant="outlined" className={classes.formControl}>
                                                <InputLabel id="demo-simple-select-outlined-label">Supplier</InputLabel>
                                                <Select
                                                    size="small"
                                                    labelId="demo-simple-select-outlined-label"
                                                    id="demo-simple-select-outlined"
                                                    value={10}
                                                    onChange={(v)=>console.log(v)}
                                                    label="Supplier"
                                                 >
                                                <MenuItem value="">
                                                    <em>None</em>
                                                </MenuItem>
                                                <MenuItem value={10}>Ten</MenuItem>
                                                <MenuItem value={20}>Twenty</MenuItem>
                                                <MenuItem value={30}>Thirty</MenuItem>
                                                </Select>
                                            </FormControl>
                                    </Column>
                                    <Column md={3} padding={[10,5]}>
                                    <TextField
                                        error={false}
                                            id="outlined-error-helper-text"
                                            label="Item Code"
                                            defaultValue=""
                                            helperText={false?"Incorrect entry.":""}
                                            variant="outlined" 
                                            />
                                    </Column>
                                    <Column md={3} padding={[10,5]}>
                                    <TextField
                                        error={false}
                                            id="outlined-error-helper-text"
                                            label="Item Name"
                                            defaultValue=""
                                            helperText={false?"Incorrect entry.":""}
                                            variant="outlined" 
                                            />
                                    </Column>
                                    <Column md={3} padding={[10,5]}>
                                    <TextField
                                        error={false}
                                            id="outlined-error-helper-text"
                                            label="Expire With in Days"
                                            defaultValue=""
                                            helperText={false?"Incorrect entry.":""}
                                            variant="outlined" 
                                            />
                                    </Column>
                                    <Column md={6} padding={[10,5]}>
                                    <TextArea 
                                               error={false}
                                                id="outlined-error-helper-text"
                                                label="Package Details"
                                                row={"4"}
                                                rowsMax={"20"} 
                                                helperText={false?"Incorrect entry.":""}
                                                variant="outlined"  
                                                />
                                    </Column>
                                    <Column right>
                                        <Row>
                                            <Column md={8}>
                                            </Column>
                                            
                                            <Column  right md={4}>
                                                <Row>
                                                    <Button className={classes.saveButton} variant="contained" color="primary">Save</Button>
                                                    <Button className={classes.saveButton} variant="contained" color="primary">Save & Add</Button>
                                                    <Button  onClick={()=>setAddEdit(false)} className={classes.closeButton} variant="contained">Cancel</Button>
                                                </Row>
                                            </Column>
                                        </Row>
                                    </Column>
                                </Row>
                            </Column>
                        </Row>
                    </Fade>
                    </Column>:null}
                    <Column left padding={[5]} padding={[10]} md={6} sm={6} xs={6}>
                        <FormControl className={classes.margin}>
                            <Select
                                labelId="demo-customized-select-label"
                                id="demo-customized-select"
                                value={[""]}
                                onChange={(v)=>console.log(v)}
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
                   {!addEdit?
                    <Column right padding={[10]} md={6} sm={6} xs={6}>
                        <Button variant="contained" color="primary" className={classes.addButton} onClick={()=>setAddEdit(true)}>Add</Button>
                    </Column>:null}
                    
                    <Column >
                      <Row>
                          <Column md={6} xs={6} sm={6} padding={[5,10,5,13]}>
                             <Row middle>
                                 <Text size={14} bold style={{marginRight:5}}>Show</Text>
                                 <FormControl className={classes.margin}>
                                        <Select
                                            labelId="demo-customized-select-label"
                                            id="demo-customized-select"
                                            value={10}
                                            onChange={(v)=>console.log(v)}  
                                            label={"Select Column To Hide"}
                                            input={<BootstrapInput />}
                                            > 
                                            <MenuItem value={10}>Ten</MenuItem>
                                            <MenuItem value={20}>Twenty</MenuItem>
                                            <MenuItem value={30}>Thirty</MenuItem>
                                        </Select>
                                    </FormControl>
                                 <Text size={14} medium style={{marginLeft:5}}>Entries</Text>
                             </Row>
                          </Column>
                          <Column md={6} xs={6} sm={6} padding={[5]} className={classes.searchCol}>
                          <div className={classes.search}>
                            <div className={classes.searchIcon}>
                            <Search/>
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
                </Row>
            </Card>
        </div>
    )
}
