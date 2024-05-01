import React from "react";
import Link from "next/link";
import { Row, Column, Text, Image, Card } from "../Core";
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Button, Box } from '@material-ui/core';
import { useRouter } from "next/router";
import LanguageConfig from "../helper/LanguageConfig"

const useStyles = makeStyles((theme) => ({
    image: {
        width: '100%',
        objectFit: 'contain'
    },
    mobileHeader: {
        display: 'none',
        [theme.breakpoints.down('sm')]: {
            display: 'flex'
        }
    },
    desktopHeader: {
        display: 'flex',
        [theme.breakpoints.down('sm')]: {
            display: 'none'
        }
    },
    cardContent: {
        padding: 20,
    }
}));


const ErrorPage = ({ search }) => {
    const router = useRouter();
    const classes = useStyles();

    return (
        <Card className={classes.cardContent}>
            <Row>
                <Column middle className={classes.mobileHeader}>
                    <Box mb={3}>
                        <Row>
                            <Column>
                                <h1>
                                    {search ? <LanguageConfig id="hotels.searchdestination" />: "Could Not Find Anything"}
                                </h1>
                                <h1>
                                    {search ? " " : "Try Again."}
                                </h1>
                            </Column>
                            <Column center middle padding={[0,10]}>
                                {search ?
                                    <div>
                                        <h2><LanguageConfig id="hotels.selectdestination" />  </h2>
                                        <h2><LanguageConfig id="hotels.choosedate" /></h2>
                                        <h2><LanguageConfig id="hotels.setoccupancy" /></h2>
                                    </div> : null
                                }
                            </Column>
                        </Row>
                    </Box>
                </Column>
                <Column md={6}>
                    <Image
                        src={!search ? "/images/error-page.png" : "/images/search-page.png"}
                        className={classes.image}
                        fit="contain"
                    />
                </Column>
                <Column md={6} center middle className={classes.desktopHeader}>
                    <Box mb={2}>
                        <h1>
                            {search ? <LanguageConfig id="hotels.searchdestination" /> : "Could Not Find Anything."}
                        </h1>
                        {search ?
                            <div style={{ padding: 10 }}>
                                <h2><LanguageConfig id="hotels.selectdestination" />  </h2>
                                <h2><LanguageConfig id="hotels.choosedate" /></h2>
                                <h2><LanguageConfig id="hotels.setoccupancy" /></h2>
                            </div> : null}
                    </Box>
                    <Box mb={2}>
                        <h3>
                            {search ? "" : "Try Again"}
                        </h3>
                    </Box>
                    {!search ?

                        <Button onlick={() => router.push({pathname:"/"})} variant="contained" color="primary" >
                            <h3>{"Go Back to Home"}</h3>
                        </Button> : null}
                </Column>
            </Row>
        </Card>
    );
};

export default ErrorPage;
