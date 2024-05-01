import React, { useState } from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Badge from '@material-ui/core/Badge';
import Divider from '@material-ui/core/Divider';
import Tooltip from '@material-ui/core/Tooltip';
import { Row, Column, Image, Card, Text } from '../../../core';
import { Paper } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';

const useStyles = makeStyles((theme) => ({
  mainImage: {
    width: '100%',
    height: 250,
    borderRadius: 5,
  },
  imageNail: {
    width: '18.9%',
    height: 65,
    margin: 2,
    marginTop: 3,
    borderRadius: 5,
    [theme.breakpoints.down('sm')]: {
      width: '18.1%',
    },
  },
  locationIcons: {
    fontSize: 20,
  },
  containerBody: {
    padding: 15,
    [theme.breakpoints.down('sm')]: {
      padding: 5,
    },
  },
  gridList: {
    flexWrap: 'nowrap',
    // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
    transform: 'translateZ(0)',
    maxHeight: 50,
    alignItems: 'center',
  },
  gridTile: {
    maxWidth: '20%',
    maxHeight: 50,
  },
  card: {
    flexGrow: 1,
    margin: 2,
  },
  itemData: {
    width: '100%',
    marginTop: 0,
    marginBottom: 0,
  },
  margin: {
    margin: theme.spacing(1),
  },
  buttonStyle: {
    width: '100%',
  },
  cardAction: {
    justifyContent: 'space-between',
    paddingLeft: '8px',
  },
  hotelPrice: {
    fontSize: '1.3rem',
    color: '#2949D5',
  },
  hotelDuration: {
    fontSize: '.9rem',
    fontWeight: 700,
  },
  cardContent: {
    paddingTop: '0',
  },
  borderHolder: {
    borderRadius: 5,
  },
}));

const EventSkeletonCard = ({ ...prop }) => {
  const classes = useStyles();
  return (
    <Card className={classes.card} variant="outlined" {...prop}>
      <Row>
        <Column md={4} xs={12} sm={12}>
          <Row>
            <Column>
              <Skeleton className={classes.mainImage} variant="rect" />
            </Column>
          </Row>
        </Column>

        <Column md={8} xs={12} sm={12} className={classes.containerBody}>
          <Row padding={[0, 0, 5, 0]}>
            <Column md={10} center>
              <Skeleton variant="text" />
            </Column>
            <Column md={2} right>
              <Skeleton variant="text" />
            </Column>
          </Row>
          <Divider gutterBottom />
          <Row padding={[10, 0]}>
            {[1, 2, 3].map((val, index) => (
              <Column key={'skelt' + index}>
                <Row>
                  <Column md={1} xs={2} sm={2} center>
                    <Skeleton variant="text" />
                  </Column>
                  <Column md={11} xs={10} sm={10}>
                    <Skeleton variant="text" />
                  </Column>
                </Row>
              </Column>
            ))}
          </Row>
          <Divider variant="middle" />
          <Row center padding={[10]}>
            <Column md={8} sm={7} xs={7} center padding={[0, 0, 0, 10]}>
              <Text component="h4" className={classes.hotelPrice}>
                <Skeleton variant="text" />
                <Skeleton variant="text" />
              </Text>
              <Text component="p" className={classes.hotelDuration}>
                <Skeleton variant="text" />
              </Text>
            </Column>
            <Column md={4} sm={5} xs={5} middle center padding={[5]}>
              <Skeleton variant="text" />
            </Column>
          </Row>
          <Divider variant="middle" />
          <Row center padding={[20, 0]}>
            <Column right>
              <Skeleton variant="react" width={150} height={40} />
            </Column>
          </Row>
        </Column>
      </Row>
    </Card>
  );
};

export default EventSkeletonCard;
