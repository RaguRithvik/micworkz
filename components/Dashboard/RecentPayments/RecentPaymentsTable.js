import React, { useState, useEffect } from 'react';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableHeading from './TableHeading';
import TableItem from './TableItem';
import Box from '@material-ui/core/Box';
import { httpPostRequest, getDateYYYYMMDD } from '../../../helper/JsHelper';
import { getRecentBooking } from '../../../helper/RequestPayLoad';
import { newConstants } from "../../../helper/constants";

// const payments=[
//   {
//     id: '13',
//     user: {
//       id: 1,
//       avatar: 'https://via.placeholder.com/150x150',
//       name: 'Fannie',
//       position: 'from India',
//     },
//     lastPaymentDate: 'May 26, 2021',
//     totalAmount: 15000,
//     pendingAmount: "15000",
//     rate: '15000',
//     workingHour: 150,
//   },
//   {
//     id: '13',
//     user: {
//       id: 1,
//       avatar: 'https://via.placeholder.com/150x150',
//       name: 'Hudson',
//       position: 'from India',
//     },
//     lastPaymentDate: 'Apr 26, 2021',
//     totalAmount: 15000,
//     pendingAmount: "15000",
//     rate: '15000',
//     workingHour: 150,
//   },
//   {
//     id: '13',
//     user: {
//       id: 1,
//       avatar: 'https://via.placeholder.com/150x150',
//       name: 'Sam',
//       position: 'from India',
//     },
//     lastPaymentDate: 'Mar 26, 2021',
//     totalAmount: 15000,
//     pendingAmount: "15000",
//     rate: '15000',
//     workingHour: 150,
//   },
//   {
//     id: '234',
//     user: {
//       id: 14,
//       avatar: 'https://via.placeholder.com/150x150',
//       name: 'Dhruva Sharma',
//       position: 'from Emirates',
//     },
//     lastPaymentDate: 'Mar 24, 2021',
//     totalAmount: 15000,
//     pendingAmount: "15000",
//     rate: '15000',
//     workingHour: 150,
//   },
//   {
//     id: '6545',
//     user: {
//       id: 14,
//       avatar: 'https://via.placeholder.com/150x150',
//       name: 'Siddharth Gautam',
//       position: 'from Canada',
//     },
//     lastPaymentDate: 'Feb 26, 2021',
//     totalAmount: 15000,
//     pendingAmount: "15000",
//     rate: '15000',
//     workingHour: 150,
//   },
//   {
//     id: '6745',
//     user: {
//       id: 1,
//       avatar: 'https://via.placeholder.com/150x150',
//       name: 'Vishnu Sharma',
//       position: 'from Srilanka',
//     },
//     lastPaymentDate: 'Jan 22, 2021',
//     totalAmount: 15000,
//     pendingAmount: "15000",
//     rate: '15000',
//     workingHour: 150,
//   },
//   {
//     id: '8754',
//     user: {
//       id: 1,
//       avatar: 'https://via.placeholder.com/150x150',
//       name: 'Rahul Sharma',
//       position: 'from Singapure',
//     },
//     lastPaymentDate: 'Dec 26, 2020',
//     totalAmount: 15000,
//     pendingAmount: "15000",
//     rate: '15000',
//     workingHour: 150,
//   },
//   {
//     id: '7556',
//     user: {
//       id: 1,
//       avatar: 'https://via.placeholder.com/150x150',
//       name: 'Mukul Kumar',
//       position: 'from France',
//     },
//     lastPaymentDate: 'Jan 26, 2020',
//     totalAmount: 15000,
//     pendingAmount: "15000",
//     rate: '15000',
//     workingHour: 150,
//   },
// ]

const RecentPaymentsTable = () => {
  const [dateValue, setDateValue] = useState(getDateYYYYMMDD(new Date()))
  const [data, setData] = useState([])

  const loadData = async () => {
    let res = await httpPostRequest(getRecentBooking(dateValue))
    if (res && res[newConstants.DATA_EXCEPTION] && res[newConstants.DATA_EXCEPTION][newConstants.ERR_CODE] == 200) {
      setData(res[newConstants.DATA][newConstants.SALES_DATA] ? res[newConstants.DATA][newConstants.SALES_DATA] : [])
    }
  }
  console.log(data)
  useEffect(() => {
    loadData()
  }, [dateValue])
  return (
    <Box className="Cmt-table-responsive">
      <Table>
        <TableHead>
          <TableHeading />
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableItem row={row} key={row.id} />
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export default RecentPaymentsTable;
