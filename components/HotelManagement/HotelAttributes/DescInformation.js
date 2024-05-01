import React, { useState, useEffect } from 'react';
import { Container, Box, Checkbox, Button, Table, TableBody, TableContainer, TableCell, TableHead, TableRow, Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Row, Column, Text, TextField } from "../../../Core";
import { useStore } from '../../../helper/Store';
import { constants, newConstants } from '../../../helper/constants';

const useStyles = makeStyles((theme) => ({
    SetupLanguagesnow: { width: '100%', float: 'left', },
    LanguageManipulation: { marginTop: '20px', },
    HotelInfortabled: { marginTop: '10px', },
    languageHeader: { fontSize: '35px', padding: '10px 20px', },
    tableHead: {
        backgroundColor: '#ffffff',
        borderBottom: '1.2px solid' + theme.palette.primary.main,
    },
    tableHeadTuple: {
        color: theme.palette.grey.light,
        fontSize: '15px',
        fontWeight: '1000',
        padding: 15,
        width: 'clamp(150px,10vw,300px)',
        minWidth: 150,
    },
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
    Languageheadernow: {fontSize: '35px', marginTop: '14px',},
}));

const DescInformation = () => {
    const classes = useStyles();
    const { languages, setAlertMsg, copylanguages } = useStore();
    const [multi_language, setMultiLanguage] = useState([])

    useEffect(() => {
        var Tab_multi = languages.map(val => ({
            [newConstants.LANG_CODE]:
            {
                value: val.value,
                is_require: true,
                error: false,
                type: 'text',
                err_msg: '',
            },
            ["title"]: {
                value: "",
                is_require: true,
                error: false,
                min_length: 1,
                max_length: null,
                type: 'text',
                err_msg: '',
            },
            ["desc"]: {
                value: "",
                is_require: true,
                error: false,
                min_length: 1,
                max_length: null,
                type: 'text',
                err_msg: '',
            },
        }))
        setMultiLanguage(Tab_multi)
    }, [languages])

    function multiStateUpdater(e, index) {
        let multi_language_ = _.cloneDeep(multi_language);
        if (e.target.value.length == 0) {
            multi_language_[index][e.target.name].error = multi_language_[index][e.target.name].is_require ? true : false;
            multi_language_[index][e.target.name].value = e.target.value;
        } else {
            multi_language_[index][e.target.name].value = e.target.value;
            multi_language_[index][e.target.name].error = false;
        }
        setMultiLanguage(multi_language_);
    }

    return (
        <div >
            <Row >
            <Column md ={12}>
            <h3 className={classes.Languageheadernow}>Description</h3>
                </Column>
                <Column padding={[5]}>
                    <div >
                        <Row>
                            <Paper style={{ width: "100%" }}>
                                <TableContainer className={classes.TableContain}>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell className={classes.tableHeadTuple}>Language</TableCell>
                                                <TableCell className={classes.tableHeadTuple}>Title</TableCell>
                                                <TableCell className={classes.tableHeadTuple}>Description</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {multi_language.map(
                                                (val, index) => (
                                                    <TableRow>
                                                        <TableCell className={classes.tableBodyTuple}>
                                                            <Text>{languages.filter(f => f.value == val[newConstants.LANG_CODE].value).length ? languages.filter(f => f.value == val[newConstants.LANG_CODE].value)[0].label :
                                                                copylanguages.filter(f => f.value == val[newConstants.LANG_CODE].value)[0].label}</Text>
                                                        </TableCell>
                                                        <TableCell className={classes.tableBodyTuple}>
                                                            <TextField
                                                                label={"title"}
                                                                type="text"
                                                                value={val["title"].value}
                                                                name={["title"]}
                                                                error={val["title"].error}
                                                                onChange={(e) => multiStateUpdater(e, index)}
                                                                helperText={val["title"].err_msg}
                                                            />
                                                        </TableCell>
                                                        <TableCell className={classes.tableBodyTuple}>
                                                            <TextField
                                                                label={"description"}
                                                                type="text"
                                                                value={val["desc"].value}
                                                                name={["desc"]}
                                                                error={val["desc"].error}
                                                                onChange={(e) => multiStateUpdater(e, index)}
                                                                helperText={val["desc"].err_msg}
                                                            />
                                                        </TableCell>
                                                    </TableRow>)
                                            )}
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

export default DescInformation;