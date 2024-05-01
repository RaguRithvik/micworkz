import React from "react";
import Link from "next/link"; 
import { Row, Column, Text,Card } from "../../core";
import { useRouter } from "next/router";
import { makeStyles, withStyles } from '@material-ui/core/styles';


const useStyles = makeStyles((theme) => ({

    image: {
     width:'100%',
     objectFit:'contain',
    [theme.breakpoints.down('sm')]: {
      minWidth: 200,
      maxWidth: 350, 
    }
  },
  cardContainer:{
       padding: 30,
       [theme.breakpoints.down('sm')]: {
         padding: 15, 
       }
  }
}));

const PaymentFailed = () => {
    const {query} = useRouter()
    const classes = useStyles();
  return (
    <div>
        <Card className={classes.cardContainer}>
          <Row>
            <Column middle md={5} lg={5} >
              <img
                src="/images/payment-declined.png"
                className={classes.image}
              />
            </Column>
            <Column md={7} xl={7} center middle>
              <Row>
                <Column center middle padding={[10]}>
                   <Text variant="h1" component="h1" color="#0A5A0A" bold>Something went room.  </Text>
                </Column>
                <Column center middle padding={[10]}>
                   <Text variant="h4" center component="h1" color="#0A5A0A" >Your room was failed, Try again.</Text>
                </Column>
                 
                 
                <Column center middle>
                    <Link href="/dashboard/searchhotels" >
                        <a>Go Back to Home Page &gt;</a>
                      </Link>
                </Column>
              </Row> 
            </Column>
          </Row>
      </Card>
    </div>
  );
};

export default PaymentFailed;
