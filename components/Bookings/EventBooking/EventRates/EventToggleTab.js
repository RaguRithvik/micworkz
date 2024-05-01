import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box, Container } from "@material-ui/core";
import { Row, Column, Text } from "../../../../core";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

const useStyles = makeStyles((theme) => ({
  heading: { fontSize: "20px", fontWeight: "600", color: "#333" },
  SynopsisPara: {
    width: "100%",
    float: "left",
    fontSize: "13px",
    fontWeight: "400 !important",
    color: "#333",
  },
  Synopsiscommoned: {
    borderRadius: "10px",
    boxShadow: "0px 0px 20px #ccc",
    margin: "10px 0px",
    border: "none !important",
    padding: 10,
  },
  SynopsisCommoneddown: { width: "100%", float: "left", },
}));

export default function SimpleAccordion({ eventData, ...props }) {
  const [expanded, setExpanded] = React.useState("panel1");
  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };
  const classes = useStyles();

  return (
    <div>
      <section className={classes.SynopsisCommoneddown}>
        <Container maxWidth="md">
          <Row>
            <Column md="12">
              <Accordion
                expanded={expanded === "panel1"}
                onChange={handleChange("panel1")}
                className={classes.Synopsiscommoned}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Text component="h3" variant="h3" className={classes.heading}>
                    {eventData["product-desc"][0]["heading-title"]}
                  </Text>
                </AccordionSummary>
                <AccordionDetails>
                  <Text
                    component="p"
                    variant="p"
                    className={classes.SynopsisPara}
                  >
                    {eventData["product-desc"][0]["detail"]}
                  </Text>
                </AccordionDetails>
              </Accordion>
              <Accordion className={classes.Synopsiscommoned}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel2a-content"
                  id="panel2a-header"
                >
                  <Text component="h3" variant="h3" className={classes.heading}>
                    {eventData["product-desc"][1]["heading-title"]}
                  </Text>
                </AccordionSummary>
                <AccordionDetails>
                  <Text
                    component="p"
                    variant="p"
                    className={classes.SynopsisPara}
                  >
                    {eventData["product-desc"][1]["detail"]}
                  </Text>
                </AccordionDetails>
              </Accordion>
              <Accordion
                className={classes.Synopsiscommoned}
                style={{ border: "none !important" }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel3a-content"
                  id="panel3a-header"
                >
                  <Text component="h3" variant="h3" className={classes.heading}>
                    {eventData["product-desc"][2]["heading-title"]}
                  </Text>
                </AccordionSummary>
                <AccordionDetails>
                  <Text
                    component="p"
                    variant="p"
                    className={classes.SynopsisPara}
                  >
                    {eventData["product-desc"][2]["detail"]}
                  </Text>
                </AccordionDetails>
              </Accordion>
            </Column>
          </Row>
        </Container>
      </section>
    </div>
  );
}
