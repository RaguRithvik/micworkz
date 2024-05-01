// import React, { useRef } from 'react';
// import { TextField, Text, Row, Column } from '../core';
// import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@material-ui/core';
// import { newConstants } from '../helper/constants';
// import LanguageConfig from "../helper/LanguageConfig";
// import { makeStyles } from '@material-ui/core/styles';
// import { useStore } from '../helper/Store';

// const useStyles = makeStyles((theme) => ({
//     tableBodyTuple: {
//         color: 'black',
//         fontSize: '.8rem',
//         fontWeight: '1000',
//         padding: 15,
//         width: 'clamp(150px,10vw,300px)',
//     },
//     TableContain: {
//         maxWidth: "300px",
//         minWidth: "100%"
//     },
//     tableHeadTuple: {
//         color: 'black',
//         fontSize: '.8rem',
//         fontWeight: '1000',
//         padding: 15,
//         textTransform: 'uppercase',
//         width: 'clamp(150px,10vw,300px)',
//     }
// }));

// const LanguageContainer = ({ multi_language, multiStateUpdater, heading = null }) => {
//     const ref = useRef();
//     const classes = useStyles();
//     const { languages, copylanguages } = useStore();

//     return (
//         <div ref={ref} >
//             <Row>
//                 <Column>
//                     <Text bold size={15}>{heading ? heading : <LanguageConfig id="ticketsupplier.languages" />}</Text>
//                 </Column>
//                 <Column margin={[5, 0, 0, 0]}>
//                     <div>
//                         <Row>
//                             <Paper style={{ width: "100%" }}>
//                                 <TableContainer className={classes.TableContain}>
//                                     <Table>
//                                         <TableHead>
//                                             <TableRow>
//                                                 {multi_language.map(val => (
//                                                     <TableCell className={classes.tableHeadTuple}>
//                                                         <Text>
//                                                             {languages.filter(f => f.value == val[newConstants.LANG_CODE].value).length ?
//                                                                 languages.filter(f => f.value == val[newConstants.LANG_CODE].value)[0].label :
//                                                                 copylanguages.filter(f => f.value == val[newConstants.LANG_CODE].value)[0].label
//                                                             }
//                                                         </Text>
//                                                     </TableCell>
//                                                 ))}
//                                             </TableRow>
//                                         </TableHead>
//                                         <TableBody>
//                                             <TableRow>
//                                                 {multi_language.map(
//                                                     (val, index) => (
//                                                         <TableCell className={classes.tableBodyTuple}>
//                                                             <TextField
//                                                                 label={"Name"}
//                                                                 type="text"
//                                                                 value={val[newConstants.TICKET_SUPPLIER_NAME].value}
//                                                                 name={newConstants.TICKET_SUPPLIER_NAME}
//                                                                 error={val[newConstants.TICKET_SUPPLIER_NAME].error}
//                                                                 onChange={(e) => multiStateUpdater(e, index, "Supplier_language")}
//                                                                 helperText={val[newConstants.TICKET_SUPPLIER_NAME].err_msg}
//                                                                 style={{width: '100%'}}
//                                                             />
//                                                         </TableCell>
//                                                     ))}
//                                             </TableRow>
//                                             <TableRow>
//                                                 {multi_language.map(
//                                                     (val, index) => (
//                                                         <TableCell className={classes.tableBodyTuple}>
//                                                             <TextField
//                                                                 label={"Address"}
//                                                                 type="text"
//                                                                 value={val[newConstants.TICKET_SUPPLIER_ADDRESS].value}
//                                                                 name={newConstants.TICKET_SUPPLIER_ADDRESS}
//                                                                 error={val[newConstants.TICKET_SUPPLIER_ADDRESS].error}
//                                                                 onChange={(e) => multiStateUpdater(e, index, "Supplier_language")}
//                                                                 helperText={val[newConstants.TICKET_SUPPLIER_ADDRESS].err_msg}
//                                                                 InputProps={{ style: { height: "auto" } }}
//                                                                 rows={2}
//                                                                 multiline
//                                                                 style={{width: '100%'}}
//                                                             />
//                                                         </TableCell>
//                                                     ))}
//                                             </TableRow>
//                                         </TableBody>
//                                     </Table>
//                                 </TableContainer>
//                             </Paper>
//                         </Row>
//                     </div>
//                 </Column>
//             </Row>
//         </div>
//     )
// }

// export default LanguageContainer;