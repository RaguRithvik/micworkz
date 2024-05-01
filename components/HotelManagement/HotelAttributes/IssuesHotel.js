import React, { useState, useEffect, useRef } from 'react';
import { TextField, Text, Card, Row, Column, Loader ,ModalComponent} from '../../../core';
import {
  Fade,
  Button,
  Box,
  Checkbox,
  Container
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useStore } from '../../../helper/Store';
import { validator, httpPostRequest } from '../../../helper/JsHelper';
import {
  createHotelIssues,
  getAllHotelIssues
} from '../../../helper/RequestPayLoad';
import { constants, newConstants } from '../../../helper/constants';
import LanguageConfig from "../../../helper/LanguageConfig";


const useStyles = makeStyles((theme) => ({
    HotelLanguageSection: {width: '100%', float: 'left', marginTop: '20px',},
    LanguageDouter: {listStyleType: 'none',},
    Roomcommonheader: { padding: '10px 0px', },
    RoomAmenitiesInformation: { listStyleType: 'none', fontSize: '14px', position: 'relative', marginTop: '10px', },
    HotelCheckernow: { position: 'absolute', left: '0px', top: '10px', padding: '0px 0px 0px 40px', },
    LanguageInformationnower: {position: 'relative',},
    LanguageHoredcheckup: {position: 'absolute', top: '10px', right: '0px',},
    Languageheadernow: {fontSize: '30px', marginBottom: '11px',},
    LanguagesInformerdatanew: {position: 'relative', },
    IncluededAddedData: {position:'absolute', top: '0px', right: '0px',},
    saveButton: {
        minWidth: 140,
        height: 40,
        margin: 5,
        width: '30%',
        backgroundColor: "#3c3c7b",
        color: "white",
        '&:hover': {
            backgroundColor: "#3c3c7b",
        },
    },
    closeButton: {
        margin: 5,
        width: '30%',
    },
}));

const IssuesHotel=()=>{
const classes = useStyles();
const { languages, setAlertMsg } = useStore();
const [issueflag,setIssueflag]=useState(false)
const [wholeIssue,setWholeIssue]=useState([])
const [storeIssues,setStoreissues]=useState([])

useEffect(() => {
    init()
}, [])

const init=async()=>{
    let res = await httpPostRequest(getAllHotelIssues(""));
      if (res && res[constants.DATA_EXCEPTION] && res[constants.DATA_EXCEPTION][constants.ERR_CODE] == 200) {
        setWholeIssue(res[constants.DATA][newConstants.HOTEL_ISSUES]);
      }
      else{
        setWholeIssue([])
        setAlertMsg({ type: 'error', msg:  res[constants.DATA_EXCEPTION].err_msg });
      } 
}


function handleIssues (value) {
  const currentIndex = storeIssues.findIndex((f) => f == value);
  if (currentIndex > -1) {
    storeIssues[currentIndex]=null
    setStoreissues(storeIssues.filter((f) => f != null));
  } else {
    setStoreissues([...storeIssues, value])
  }
};

    return(
        <div>
            <section className={classes.HotelLanguageSection}>
                
                <Box className={classes.LanguagesInformerdatanew}>
                    <h3 className={classes.Languageheadernow}>Issues</h3>
                    <Box className={classes.IncluededAddedData}>
                        <Button variant="outlined" color="primary" className={classes.RoomAmenityAdded} onClick={()=>setIssueflag(true)}>Add Issues</Button>
                    </Box>
                </Box>
                <ModalComponent open={issueflag} setOpen={setIssueflag}>
                 <Issues issueflag={issueflag} setIssueflag={setIssueflag} init={init}/>   
                </ModalComponent>    
                <Container>
                    <Row>
                    {wholeIssue.map((val, index) => (
                        <Column md="3" padding={[0,10]}>
                           <Box className={classes.RoomAmenitiesInformation}>
                                <li><Checkbox
                                    size="small"
                                    color="primary"
                                    inputProps={{ "aria-label": "uncontrolled-checkbox" }} 
                                    checked={storeIssues.includes(val)}
                                    onChange={(e) => handleIssues(val)}/></li>
                                <Box className={classes.HotelCheckernow}>
                                    <li>{val["hotel-issues-title"]}</li>
                                </Box>
                            </Box>
                        </Column> 
                        ))}   
                    </Row>    
                </Container>
            </section>
        </div>
    );
};


const Issues=({setIssueflag,issueflag,init})=>{
    const classes = useStyles();
    const { languages, setAlertMsg } = useStore();   
  
    return (
      <div>
            <Fade>
              <EditContainer
                classes={classes}
                setAlertMsg={setAlertMsg}
                setIssueflag={setIssueflag}
                issueflag={issueflag}
                init={init}
              />
            </Fade>
           </div>
    );
  }
  const EditContainer = ({ classes,  setAlertMsg ,setIssueflag,issueflag,init}) => {
    const [localFields, setLocalFields] = useState([]);
    const [loader, setLoader] = useState(false);
    useEffect(() => {
        setLocalFields({
          [newConstants.HOTEL_ISSUES_TITLE]: {
            value: '',
            is_require: true,
            error: false,
            min_length: 2,
            max_length: null,
            type: 'text',
            err_msg: '',
          },
          [newConstants.HOTEL_ISSUES_DESC]: {
            value: '',
            is_require: true,
            error: false,
            min_length: 2,
            max_length: null,
            type: 'text',
            err_msg: '',
          },
          [newConstants.IS_ACTIVE]: {
            value: true,
            is_require: false,
            error: false,
            type: 'boolean',
            err_msg: '',
          },
        });
    }, []);
  
    const stateUpdater = (e) => {
      let localFields_ = _.cloneDeep(localFields);
      if (e.target.value.length == 0) {
        localFields_[e.target.name].error = localFields_[e.target.name].is_require ? true : false;
        localFields_[e.target.name].value = e.target.value;
      } else {
        localFields_[e.target.name].error = false;
        localFields_[e.target.name].value = e.target.value;
      }
      setLocalFields(localFields_);
    };
  
  
    const save = async () => {
  
      let localFields_validation = _.cloneDeep(localFields);
      localFields_validation = validator(localFields_validation);
      if (localFields_validation.err) {
        setLocalFields(localFields_validation.values);
      }
  
  
      if (!localFields_validation.err) {
        setLoader(true);
          let res = await httpPostRequest(createHotelIssues(localFields, []));
          if (res && res[constants.DATA_EXCEPTION] && res[constants.DATA_EXCEPTION][constants.ERR_CODE] == 200) {
            setLoader(false);
            setIssueflag(false);
            init()
            setAlertMsg({ type: 'success', msg:  res[constants.DATA_EXCEPTION].err_msg });
  
          } else {
            setLoader(false);
            setAlertMsg({ type: 'error', msg:  res[constants.DATA_EXCEPTION].err_msg });
          }
      } else {
        setAlertMsg({ type: 'error', msg: <LanguageConfig id="hotelissues.fillrequired" /> });
      }
    };
    return (
      <div>
        {localFields.hasOwnProperty(newConstants.HOTEL_ISSUES_TITLE) ? (
          <Row padding={[10]}>
            <Column>
              <Row>
                <Column md={3} padding={[10, 5]}>
                  <TextField
                    label={<LanguageConfig id={"hotelissues.hotelissuetitle"} />}
                    name={newConstants.HOTEL_ISSUES_TITLE}
                    value={localFields[newConstants.HOTEL_ISSUES_TITLE].value}
                    onChange={stateUpdater}
                    error={localFields[newConstants.HOTEL_ISSUES_TITLE].error}
                    helperText={localFields[newConstants.HOTEL_ISSUES_TITLE].err_msg}
                    required={localFields[newConstants.HOTEL_ISSUES_TITLE].is_require}
                  />
                </Column>
                <Column md={3} padding={[10, 5]}>
                  <TextField
                    label={<LanguageConfig id={"hotelissues.hotelissuedesc"} />}
                    name={newConstants.HOTEL_ISSUES_DESC}
                    value={localFields[newConstants.HOTEL_ISSUES_DESC].value}
                    onChange={stateUpdater}
                    error={localFields[newConstants.HOTEL_ISSUES_DESC].error}
                    helperText={localFields[newConstants.HOTEL_ISSUES_DESC].err_msg}
                    required={localFields[newConstants.HOTEL_ISSUES_DESC].is_require}
                  />
                </Column>
                {/* {editData && localFields[newConstants.IS_ACTIVE] && localFields[newConstants.IS_ACTIVE].hasOwnProperty('value') && (
                    <Column md={3}padding={[10, 5]} center>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={localFields[newConstants.IS_ACTIVE].value}
                            color="primary"
                            onChange={() =>
                              setLocalFields({
                                ...localFields,
                                [newConstants.IS_ACTIVE]: {
                                  ...localFields[newConstants.IS_ACTIVE],
                                  value: !localFields[newConstants.IS_ACTIVE].value,
                                },
                              })
                            }
                            name={newConstants.IS_ACTIVE}
                          />
                        }
                        label={<LanguageConfig id="hoteltags.isactive" />}
                      />
                    </Column>
                  )} */}
                <Column right>
                  <Row>
                    <Column md={8}></Column>
  
                    <Column right md={4}>
                      <Row style={{ placeContent: 'flex-end' }}>
                        <Button
                          className={classes.saveButton}
                          variant="contained"
                          color="primary"
                          style={{ width: '30%' }}
                          onClick={loader ? console.log('') : save}>
                          <Row>
                            {loader ? (
                              <Column md={1} xs={1} sm={1} center middle>
                                <Loader size={14} color={'white'} />
                              </Column>
                            ) : null}
                            <Column md={loader ? 11 : 12} xs={loader ? 11 : 12} center middle sm={loader ? 11 : 12}>
                              <LanguageConfig id={ "save"} />
                            </Column>
                          </Row>
                        </Button>
                        <Button
                          onClick={() => {
                            setIssueflag(false);
                            // setEditData(null);
                          }}
                          className={classes.closeButton}
                          style={{ width: '30%' }}
                          variant="contained">
                          <LanguageConfig id="hotelissues.cancel" />
                        </Button>
                      </Row>
                    </Column>
                  </Row>
                </Column>
              </Row>
            </Column>
          </Row>
        ) : null}
      </div>
    );
  };
  
 

export default IssuesHotel;