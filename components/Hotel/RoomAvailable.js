// import { MonthlyBody, MonthlyCalendar, MonthlyNav, DefaultMonthlyEventItem } from '@zach.codes/react-calendar';
import React, { useState, useEffect } from "react"
import moment from 'moment';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import {Today, Add} from '@material-ui/icons';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import DateRangePicker from "react-daterange-picker";
import LanguageConfig, { LanguageConfigFn } from "../../helper/LanguageConfig"
import { getDateddMMMyyyy } from '../../helper/JsHelper';
import {
  Text,
  TextField,
  Card,
  Row,
  Column,
  Touchable,
  CustomTooltip,
  Loader,
  ModalComponent,
} from '../../core';
import {
  Fade,
  Button,
  Fab,
} from '@material-ui/core';
const localizer = momentLocalizer(moment);
const now = new Date();


const useStyles = makeStyles((theme) => ({
  fab: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
  startDateEndDateContainer: {
    '&:hover': {
      backgroundColor: '#F2F2F2',
      borderRadius: 5
    }
  },
 
}));


export default function RoomAvailable() {
  const classes = useStyles()
  const [value, setValue] = useState(
    moment.range(
      moment().clone().add(0, "days"),
      moment().clone().add(1, "days"),
    ),
  )
  const [date, setDate] = useState(false)
  const [price, setPrice] = useState({ title: "", start: "", end: "" })
  const [open, setOpen] = useState(false)
  const [events, setEvents] = useState([
    {
      id: 0,
      title: 'All Day Event very long title',
      allDay: true,
      start: new Date(2015, 3, 0),
      end: new Date(2015, 3, 1),
    },
    {
      id: 1,
      title: 'Long Event',
      start: new Date(2015, 3, 7),
      end: new Date(2015, 3, 10),
    },

    {
      id: 2,
      title: 'DTS STARTS',
      start: new Date(2016, 2, 13, 0, 0, 0),
      end: new Date(2016, 2, 20, 0, 0, 0),
    },

    {
      id: 3,
      title: 'DTS ENDS',
      start: new Date(2016, 10, 6, 0, 0, 0),
      end: new Date(2016, 10, 13, 0, 0, 0),
    },

    {
      id: 4,
      title: 'Some Event',
      start: new Date(2015, 3, 9, 0, 0, 0),
      end: new Date(2015, 3, 10, 0, 0, 0),
    },
    {
      id: 5,
      title: 'Conference',
      start: new Date(2015, 3, 11),
      end: new Date(2015, 3, 13),
      desc: 'Big conference for important people',
    },
    {
      id: 6,
      title: 'Meeting',
      start: new Date(2015, 3, 12, 10, 30, 0, 0),
      end: new Date(2015, 3, 12, 12, 30, 0, 0),
      desc: 'Pre-meeting meeting, to prepare for the meeting',
    },
    {
      id: 7,
      title: 'Lunch',
      start: new Date(2015, 3, 12, 12, 0, 0, 0),
      end: new Date(2015, 3, 12, 13, 0, 0, 0),
      desc: 'Power lunch',
    },
    {
      id: 8,
      title: 'Meeting',
      start: new Date(2015, 3, 12, 14, 0, 0, 0),
      end: new Date(2015, 3, 12, 15, 0, 0, 0),
    },
    {
      id: 9,
      title: 'Happy Hour',
      start: new Date(2015, 3, 12, 17, 0, 0, 0),
      end: new Date(2015, 3, 12, 17, 30, 0, 0),
      desc: 'Most important meal of the day',
    },
    {
      id: 10,
      title: 'Dinner',
      start: new Date(2015, 3, 12, 20, 0, 0, 0),
      end: new Date(2015, 3, 12, 21, 0, 0, 0),
    },
    {
      id: 11,
      title: 'Planning Meeting with Paige',
      start: new Date(2015, 3, 13, 8, 0, 0),
      end: new Date(2015, 3, 13, 10, 30, 0),
    },
    {
      id: 11.1,
      title: 'Inconvenient Conference Call',
      start: new Date(2015, 3, 13, 9, 30, 0),
      end: new Date(2015, 3, 13, 12, 0, 0),
    },
    {
      id: 11.2,
      title: "Project Kickoff - Lou's Shoes",
      start: new Date(2015, 3, 13, 11, 30, 0),
      end: new Date(2015, 3, 13, 14, 0, 0),
    },
    {
      id: 11.3,
      title: 'Quote Follow-up - Tea by Tina',
      start: new Date(2015, 3, 13, 15, 30, 0),
      end: new Date(2015, 3, 13, 16, 0, 0),
    },
    {
      id: 12,
      title: 'Late Night Event',
      start: new Date(2015, 3, 17, 19, 30, 0),
      end: new Date(2015, 3, 18, 2, 0, 0),
    },
    {
      id: 12.5,
      title: 'Late Same Night Event',
      start: new Date(2015, 3, 17, 19, 30, 0),
      end: new Date(2015, 3, 17, 23, 30, 0),
    },
    {
      id: 13,
      title: 'Multi-day Event',
      start: new Date(2015, 3, 20, 19, 30, 0),
      end: new Date(2015, 3, 22, 2, 0, 0),
    },
    {
      id: 14,
      title: 'Today',
      start: new Date(new Date().setHours(new Date().getHours() - 3)),
      end: new Date(new Date().setHours(new Date().getHours() + 3)),
    },
    {
      id: 15,
      title: 'Point in Time Event',
      start: now,
      end: now,
    },
    {
      id: 16,
      title: 'Video Record',
      start: new Date(2015, 3, 14, 15, 30, 0),
      end: new Date(2015, 3, 14, 19, 0, 0),
    },
    {
      id: 17,
      title: 'Dutch Song Producing',
      start: new Date(2015, 3, 14, 16, 30, 0),
      end: new Date(2015, 3, 14, 20, 0, 0),
    },
    {
      id: 18,
      title: 'Itaewon Halloween Meeting',
      start: new Date(2015, 3, 14, 16, 30, 0),
      end: new Date(2015, 3, 14, 17, 30, 0),
    },
    {
      id: 19,
      title: 'Online Coding Test',
      start: new Date(2015, 3, 14, 17, 30, 0),
      end: new Date(2015, 3, 14, 20, 30, 0),
    },
    {
      id: 20,
      title: 'An overlapped Event',
      start: new Date(2015, 3, 14, 17, 0, 0),
      end: new Date(2015, 3, 14, 18, 30, 0),
    },
    {
      id: 21,
      title: 'Phone Interview',
      start: new Date(2015, 3, 14, 17, 0, 0),
      end: new Date(2015, 3, 14, 18, 30, 0),
    },
    {
      id: 22,
      title: 'Cooking Class',
      start: new Date(2015, 3, 14, 17, 30, 0),
      end: new Date(2015, 3, 14, 19, 0, 0),
    },
    {
      id: 23,
      title: 'Go to the gym',
      start: new Date(2015, 3, 14, 18, 30, 0),
      end: new Date(2015, 3, 14, 20, 0, 0),
    },
  ]);


  const handleSelect = () => {
    setEvents([...events, {title:price.title,start:value?.start?._d,end:value?.end?._d}])
    setOpen(false)
    setPrice({title:"",start:"",end:""})
  }

  console.log(value)

  const stateUpdater = (e) => {
    setPrice({ ...price, [e.target.name]: e.target.value })
  }

  return (
    <div>     
      <ModalComponent open={open} setOpen={setOpen} >
      <Row>
      <Column md={5} xl={5} xs={12} sm={12} padding={[5]}>
        <TextField
          type="price"
          id="effective-from-id"
          label={"price"}
          variant="outlined"
          margin="dense"
          value={price.title}
          name="title"
          onChange={stateUpdater}
        />
        </Column>
        <Column md={5} xl={5} xs={12} sm={12} padding={[5]}>
          <Card>
            <Touchable onClick={() => setDate(true)} className={classes.startDateEndDateContainer} >
              <Row padding={[2, 0]}>
                <Column xs={2} sm={2} md={2} center middle>
                  <Today />
                </Column>
                <Column xs={10} sm={10} md={10}>
                  <Row>
                    <Column padding={[0, 5]}>
                      <Text color="#003399" size={12} bold>{<LanguageConfig id="hotels.startandenddate" />}</Text>
                    </Column>
                    <Column >
                      <Row >
                        <Text size={12} semibold color="black">{getDateddMMMyyyy(value?.start?._d)}</Text>
                        <Text size={14} color={"#003399"} bold style={{ paddingLeft: 5, paddingRight: 5 }}><LanguageConfig id="hotels.to" /></Text>
                        <Text size={12} semibold color="black">{getDateddMMMyyyy(value?.end?._d)}</Text>
                      </Row>
                    </Column>
                  </Row>
                </Column>
              </Row>
            </Touchable>

            <CustomTooltip open={date} onClose={() => setDate(false)}>
              <DateRangePicker
                value={value}
                onSelect={(value, states) => {
                  setValue(value)
                  setDate(false)
                }}
                singleDateRange={true}
              />
            </CustomTooltip>
          </Card>
        </Column>
        <Column md={2} xl={2} xs={12} sm={12} padding={[5]}>
        <Button color="primary" variant="contained" style={{height:44}} onClick={handleSelect}>Create</Button>
        </Column>
        </Row>
      </ModalComponent>
      <Calendar
        selectable
        defaultView="month" localizer={localizer}
        style={{ height: 500, width: '95%' }}
        events={events}
        startAccessor="start" endAccessor="end"
        onSelectEvent={event => alert(event.title)}
      />     
      <Fab aria-label={"add"} className={classes.fab} color={"primary"} onClick={() => setOpen(true)}>
        <Add />
      </Fab>
    </div>
  );
}
