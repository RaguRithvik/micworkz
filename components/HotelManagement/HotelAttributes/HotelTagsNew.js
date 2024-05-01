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
  createHotelTag,
  getAllHotelTag,
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

const HotelTagsNew=()=>{
const classes = useStyles();
const { languages, setAlertMsg } = useStore();
const [tagflag,setTagflag]=useState(false)
const [wholeTag,setWholeTag]=useState([])
const [storeTag,setStoretag]=useState([])

useEffect(() => {
    init()
}, [])

const init=async()=>{
    let res = await httpPostRequest(getAllHotelTag(""));
      if (res && res[constants.DATA_EXCEPTION] && res[constants.DATA_EXCEPTION][constants.ERR_CODE] == 200) {
        setWholeTag(res[constants.DATA][newConstants.HOTEL_TAGS]);
      }
      else{
        setWholeTag([])
        setAlertMsg({ type: 'error', msg:  res[constants.DATA_EXCEPTION].err_msg });
      } 
}


function handleTags (value) {
  const currentIndex = storeTag.findIndex((f) => f == value);
  if (currentIndex > -1) {
    storeTag[currentIndex]=null
    setStoretag(storeTag.filter((f) => f != null));
  } else {
      setStoretag([...storeTag, value])
  }
};

console.log(storeTag)


    return(
        <div>
            <section className={classes.HotelLanguageSection}>                
                <Box className={classes.LanguagesInformerdatanew}>
                    <h3 className={classes.Languageheadernow}>Tags</h3>
                    <Box className={classes.IncluededAddedData}>
                        <Button variant="outlined" color="primary" className={classes.RoomAmenityAdded} onClick={()=>setTagflag(true)}>Add Tags</Button>
                    </Box>
                </Box>
                <ModalComponent open={tagflag} setOpen={setTagflag}>
                 <HotelTags tagflag={tagflag} setTagflag={setTagflag} init={init}/>   
                </ModalComponent>    
                <Container>
                    <Row>
                    {wholeTag.map((val, index) => (
                        <Column md="3" padding={[0,10]}>
                           <Box className={classes.RoomAmenitiesInformation}>
                                <li><Checkbox
                                    size="small"
                                    color="primary"
                                    inputProps={{ "aria-label": "uncontrolled-checkbox" }} 
                                    checked={storeTag.includes(val)}
                                    onChange={(e) => handleTags(val)}/></li>
                                <Box className={classes.HotelCheckernow}>
                                    <li>{val["hotel-tag-name"]}</li>
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


const HotelTags=({setTagflag,tagflag,init})=>{
    const classes = useStyles();
    const { languages, setAlertMsg } = useStore();   
  
    return (
      <div>
            <Fade>
              <EditContainer
                classes={classes}
                setAlertMsg={setAlertMsg}
                setTagflag={setTagflag}
                tagflag={tagflag}
                init={init}
              />
            </Fade>
           </div>
    );
  }
  const EditContainer = ({ classes,  setAlertMsg ,setTagflag,tagflag,init}) => {
    const [localFields, setLocalFields] = useState([]);
    const [loader, setLoader] = useState(false);
    useEffect(() => {
        setLocalFields({
          [newConstants.HOTEL_TAG_NAME]: {
            value: '',
            is_require: true,
            error: false,
            min_length: 2,
            max_length: null,
            type: 'text',
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
          let res = await httpPostRequest(createHotelTag(localFields, []));
          if (res && res[constants.DATA_EXCEPTION] && res[constants.DATA_EXCEPTION][constants.ERR_CODE] == 200) {
            setLoader(false);
            setTagflag(false);
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
        {localFields.hasOwnProperty(newConstants.HOTEL_TAG_NAME) ? (
          <Row padding={[10]}>
            <Column>
              <Row>
                <Column md={3} padding={[10, 5]}>
                  <TextField
                    label={<LanguageConfig id={"tag name"} />}
                    name={newConstants.HOTEL_TAG_NAME}
                    value={localFields[newConstants.HOTEL_TAG_NAME].value}
                    onChange={stateUpdater}
                    error={localFields[newConstants.HOTEL_TAG_NAME].error}
                    helperText={localFields[newConstants.HOTEL_TAG_NAME].err_msg}
                    required={localFields[newConstants.HOTEL_TAG_NAME].is_require}
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
                            setTagflag(false);
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
  
 

export default HotelTagsNew;