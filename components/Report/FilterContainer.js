
// Filter Container
import { KeyboardDatePicker } from '@material-ui/pickers';
import Autocomplete from '@material-ui/lab/Autocomplete';
import LanguageConfig from "../../helper/LanguageConfig";
import { Button, MenuItem } from '@material-ui/core';
import { TextField, Text, Card, Row, Column, Glyphi, Loader, CustomAlert, DemandDropDown } from '../../core';
const FilterContainer = ({
    startDateLabel = null,

    classes,
    startDate,
    setStartDate,
    branch,
    setBranch,
    allBranches,
    genLoader,
    viewLoader,
    viewBtnHandler,
    generateBtnHandler,

    legderCumm = false,
    endDate,
    setEndDate,
    allLedgers,
    selectedLedger,
    setSelectedLedger,
    searchLedger,
    setSearchLedger,

    salesReportFlag = false,
    reportStatus,
    setStatus,
}) => {
    const statuses = [
        { value: 'N', label: 'Pending', },
        { value: 'Y', label: 'Confirm', }
    ];
    return (
        <div style={{marginTop: '60px'}}>
            <Row padding={[10]}>
                <Column>
                    <Row>
                        <Column md={3} padding={[10, 5]}>
                            <KeyboardDatePicker
                                autoFocus={true}
                                autoOk
                                variant="inline"
                                inputVariant="outlined"
                                label={startDateLabel ? startDateLabel : "Start Date*"}
                                format="DD/MM/YYYY"
                                size="small"
                                value={startDate}
                                InputAdornmentProps={{ position: 'start' }}
                                onChange={date => setStartDate(date ? date['_d'] : new Date())}
                            />
                        </Column>

                        {legderCumm &&
                            <>
                                <Column md={3} padding={[10, 5]}>
                                    <KeyboardDatePicker
                                        autoOk
                                        variant="inline"
                                        inputVariant="outlined"
                                        label="End Date*"
                                        format="DD/MM/YYYY"
                                        size="small"
                                        value={endDate}
                                        InputAdornmentProps={{ position: 'start' }}
                                        onChange={date => setEndDate(date ? date['_d'] : new Date())}
                                    />
                                </Column>

                                <Column md={3} padding={[10, 5]}>
                                    <Autocomplete
                                        // style={{ display: "inline-flex" }}
                                        size="small"
                                        value={selectedLedger}
                                        getOptionLabel={option => option["ledger-name"]}
                                        onChange={(event, newValue) => {
                                            setSelectedLedger(newValue);
                                        }}
                                        inputValue={searchLedger}
                                        onInputChange={(event, newInputValue) => {
                                            setSearchLedger(newInputValue);
                                        }}
                                        id="controllable-states-demo"
                                        options={allLedgers}
                                        renderInput={(params) => <TextField {...params} label="Ledger*" variant="outlined" className="input_height" />}
                                    />
                                </Column>
                            </>
                        }

                        {salesReportFlag &&
                            <>
                                <Column md={3} padding={[10, 5]}>
                                    <KeyboardDatePicker
                                        autoOk
                                        variant="inline"
                                        inputVariant="outlined"
                                        label="End Date*"
                                        format="DD/MM/YYYY"
                                        size="small"
                                        value={endDate}
                                        InputAdornmentProps={{ position: 'start' }}
                                        onChange={date => setEndDate(date ? date['_d'] : new Date())}
                                    />
                                </Column>

                                <Column md={3} padding={[10, 5]}>
                                    <TextField
                                        id="outlined-select-currency"
                                        size="small"
                                        select
                                        label="Select"
                                        value={reportStatus}
                                        onChange={e => setStatus(e.target.value)}
                                        // helperText="Please select your currency"
                                        variant="outlined"
                                    >
                                        {statuses.map((option) => (
                                            <MenuItem key={option.value} value={option.value}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Column>
                            </>
                        }

                        <Column md={3} padding={[10, 5]}>
                            <TextField
                                id="outlined-select"
                                size="small"
                                select
                                label="Branch*"
                                value={branch}
                                onChange={e => setBranch(e.target.value)}
                                variant="outlined"
                            >
                                {allBranches.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Column>
                        <Column md={3} padding={[10, 5]} >
                        </Column>

                        <Column right>
                            <Row>
                                <Column md={9}></Column>
                                <Column right md={3}>
                                    <Row style={{ placeContent: 'flex-end' }}>
                                        <Button
                                            className={classes.saveButton}
                                            variant="contained"
                                            color="primary"
                                            disabled={genLoader}
                                            onClick={generateBtnHandler}
                                        >
                                            <Row>
                                                {genLoader ? (
                                                    <Column md={1} xs={1} sm={1} center middle>
                                                        <Loader size={14} color={'white'} />
                                                    </Column>
                                                ) : null}
                                                <Column md={genLoader ? 11 : 12} xs={genLoader ? 11 : 12} center middle sm={genLoader ? 11 : 12}>
                                                    <LanguageConfig id={"Generate"} />
                                                </Column>
                                            </Row>
                                        </Button>
                                        <Button
                                            onClick={viewBtnHandler}
                                            className={classes.closeButton}
                                            variant="contained"
                                            disabled={viewLoader}
                                        >
                                            <Row>
                                                {viewLoader ? (
                                                    <Column md={1} xs={1} sm={1} center middle>
                                                        <Loader size={14} color={'white'} />
                                                    </Column>
                                                ) : null}
                                                <Column md={viewLoader ? 11 : 12} xs={viewLoader ? 11 : 12} center middle sm={viewLoader ? 11 : 12}>
                                                    <LanguageConfig id={"View"} />
                                                </Column>
                                            </Row>
                                        </Button>
                                    </Row>
                                </Column>
                            </Row>
                        </Column>
                    </Row>
                </Column>
            </Row>
        </div>
    );
};

export default FilterContainer;