import React, { useRef } from 'react';
import { TextField, Text, Row, Column } from '../core';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@material-ui/core';
import { newConstants } from '../helper/constants';
import LanguageConfig from "../helper/LanguageConfig";
import { makeStyles } from '@material-ui/core/styles';
import { useStore } from '../helper/Store';

const useStyles = makeStyles((theme) => ({
    tableBodyTuple: {
        color: 'black',
        fontSize: '.8rem',
        fontWeight: '1000',
        padding: 15,
        width: 'clamp(150px,10vw,300px)',
    },
    TableContain: {
        maxWidth: "300px",
        minWidth: "100%"
    },
    tableHeadTuple: {
        color: 'black',
        fontSize: '.8rem',
        fontWeight: '1000',
        padding: 15,
        textTransform: 'uppercase',
        width: 'clamp(150px,10vw,300px)',
    }
}));

const GeneralLanguageContainer = ({ multi_language, multiStateUpdater, constant, fieldLabel, heading = null, isMoreFields = false, onchangeParam = null }) => {
    const ref = useRef();
    const classes = useStyles();
    const { languages, copylanguages } = useStore();

    return (
        <div ref={ref} >
            <Row>
                <Column>
                    <Text bold size={15}>{heading ? heading : <LanguageConfig id="general.languages" />}</Text>
                </Column>
                <Column margin={[5, 0, 0, 0]}>
                    <div>
                        <Row>
                            <Paper style={{ width: "100%" }}>
                                <TableContainer className={classes.TableContain}>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                {multi_language.map(val => (
                                                    <TableCell className={classes.tableHeadTuple}>
                                                        <Text>
                                                            {languages.filter(f => f.value == val[newConstants.LANG_CODE].value).length ?
                                                                languages.filter(f => f.value == val[newConstants.LANG_CODE].value)[0].label :
                                                                copylanguages.filter(f => f.value == val[newConstants.LANG_CODE].value)[0].label
                                                            }
                                                        </Text>
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            <TableRow>
                                                {multi_language.map(
                                                    (val, index) => (
                                                        <TableCell className={classes.tableBodyTuple}>
                                                            <TextField
                                                                label={<LanguageConfig id={fieldLabel} />}
                                                                type="text"
                                                                value={val[constant].value}
                                                                name={constant}
                                                                onChange={(e) => onchangeParam ? multiStateUpdater(e, index, onchangeParam) : multiStateUpdater(e, index)}
                                                                helperText={val[constant].err_msg}
                                                                style={{ width: '100%' }}
                                                            />
                                                        </TableCell>
                                                    ))}
                                            </TableRow>
                                            <TableRow>
                                                {multi_language.map(
                                                    (val, index) => (
                                                        <>
                                                            {isMoreFields && isMoreFields.type === 'address' &&
                                                                <TableCell className={classes.tableBodyTuple}>
                                                                    <TextField
                                                                        label={<LanguageConfig id={isMoreFields.fieldLabel} />}
                                                                        type="text"
                                                                        value={val[isMoreFields.constant].value}
                                                                        name={isMoreFields.constant}
                                                                        onChange={(e) => onchangeParam ? multiStateUpdater(e, index, onchangeParam) : multiStateUpdater(e, index)}
                                                                        helperText={val[isMoreFields.constant].err_msg}
                                                                        InputProps={{ style: { height: "auto" } }}
                                                                        rows={2}
                                                                        multiline
                                                                        style={{ width: '100%' }}
                                                                    />
                                                                </TableCell>
                                                            }

                                                            {isMoreFields && isMoreFields.type === 'text' &&
                                                                <TableCell className={classes.tableBodyTuple}>
                                                                    <TextField
                                                                        label={<LanguageConfig id={isMoreFields.fieldLabel} />}
                                                                        type="text"
                                                                        value={val[isMoreFields.constant].value}
                                                                        name={isMoreFields.constant}
                                                                        onChange={(e) => onchangeParam ? multiStateUpdater(e, index, onchangeParam) : multiStateUpdater(e, index)}
                                                                        helperText={val[isMoreFields.constant].err_msg}
                                                                        style={{ width: '100%' }}
                                                                    />
                                                                </TableCell>
                                                            }
                                                        </>
                                                    ))}
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Paper>
                        </Row>
                    </div>
                </Column>
            </Row>
        </div>
    )
}

export default GeneralLanguageContainer;