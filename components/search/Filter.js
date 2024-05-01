import React, { useState, useEffect } from "react";
import { Row, Column, Card } from "../../Core";
import { FormControlLabel, Checkbox } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import Skeleton from "@material-ui/lab/Skeleton";

const useStyles = makeStyles((theme) => ({
    filterButton: {
        backgroundColor: 'black'
    },
    skelition: {
        width: '100%',
        height: 14
    },
    ckeckBoxLabel: {
        fontStyle: 'bold',
        color: 'black'
    },
    optionLabel: {
        color: '#15830B',
        fontWeight: '700'
    }
}))

const HotelListSidebar = ({ filtersList, setFilter,currency }) => {
    const [ammunitiesm, setAmmunities] = useState([]);
    const [priceRange, setPriceRange] = useState([])
    const [priceIndex, setPriceIndex] = useState([]);
    const [starRating, setStarRating] = useState([]);
    const classes = useStyles()

    function addToAmmunities(value,index) { 
        if (ammunitiesm.includes(index)) {
            setAmmunities(ammunitiesm.map((f,i) => f != index ? f : null).filter(f => f != null))
        }
        else {
            setAmmunities([...ammunitiesm, index])
        }
    }
    useEffect(() => {
        let price_range = [];
        if (filtersList && filtersList.priceRanges && filtersList.priceRanges.from) {
            let inc = (filtersList.priceRanges.to - filtersList.priceRanges.from) / 8
            for (let i = filtersList.priceRanges.from; i <= filtersList.priceRanges.to; i = i + inc) {
                price_range.push([parseInt(i), i + inc <= filtersList.priceRanges.to ? parseInt(i + inc) : parseInt(filtersList.priceRanges.to)])
            }
            setPriceRange(price_range)
        }
    }, [filtersList])

    useEffect(() => {
        if (priceIndex != null || ammunitiesm.length > 0 || starRating.length) {
            setFilter({ price_range: priceRange.map((val, index) => priceIndex.includes(index) ? val : null).filter(f => f != null), starRating: starRating, ammunitiesm: ammunitiesm })
        }
    }, [priceIndex, starRating, ammunitiesm])

    function selectPrices(index) {
        let i = priceIndex.findIndex(f => f == index);
        if (i > -1) {
            priceIndex[i] = null;
            setPriceIndex(priceIndex.filter(f => f != null));
        }
        else {
            setPriceIndex([...priceIndex, index]);
        }
    }
    function selectRating(index) {
        console.log(index,"aaa")
        let i = starRating.findIndex(f => f == index);
        if (i > -1) {
            starRating[i] = null;
            setStarRating(starRating.filter(f => f != null));
        }
        else {
            setStarRating([...starRating, index]);
        }
    }
    return (
        filtersList && filtersList.ammenities ?
            <div>
                <Row>
                    <Column>
                        <Card padding={[10]}>
                            {
                                filtersList && filtersList.ammenities ?
                                    <Row>
                                        {priceRange.length ? <Column > <h2>Price</h2> </Column> : null}
                                        {
                                            priceRange.map((value, index) => (
                                                <Column key={"price_rnage_" + index} padding={[0, 10]}>
                                                    <FormControlLabel control={<Checkbox checked={priceIndex.includes(index)} onChange={(e) => selectPrices(index)} />} label={<p className={classes.optionLabel}>{currency} {value.length > 1 ? (value[0] + " - " + value[1]) : value[0]}</p>} />
                                                </Column>
                                            ))
                                        }
                                        {
                                            filtersList && filtersList.starRatings && filtersList.starRatings.length ?
                                                <Column>
                                                    <h2>Star rating</h2>
                                                </Column> : null
                                        }
                                        {filtersList && filtersList.starRatings && filtersList.starRatings.length ?
                                            filtersList.starRatings.map((value, index) => (
                                                <Column padding={[0, 10]}>
                                                    <FormControlLabel control={<Checkbox checked={starRating.includes(value.hotelCategoryGroupId)} onChange={(e) => selectRating(value.hotelCategoryGroupId)} />} label={<p className={classes.optionLabel}>{value.hotelCategoryGroupName}</p>} />
                                                </Column>)) : null}

                                        {filtersList.ammenities ?
                                            <Column>
                                                <h2>Ammunities</h2>
                                            </Column> : null}
                                        {
                                            filtersList.ammenities.map((value, index) => (
                                                <Column key={"ammenities_" + index} padding={[0, 10]}>
                                                    <FormControlLabel className={{ label: classes.ckeckBoxLabel }} control={<Checkbox checked={ammunitiesm.includes(index)} onChange={(e) => addToAmmunities(value,index)} name={value.amenityName} />} label={<p className={classes.optionLabel}>{value.amenityName}</p>} />
                                                </Column>
                                            ))
                                        }
                                    </Row> : null}
                        </Card>
                    </Column>
                </Row>
            </div>
            : <SkelitonContainer classes={classes} />
    );
};

export default HotelListSidebar;

const SkelitonContainer = ({ classes }) => {
    return (
        <Card>
            <Row padding={[10]}>
                <Column padding={[5]}><Skeleton variant="rect" className={classes.skelition} /></Column>
                <Column padding={[5]}>
                    {
                        [1, 2, 3, 4, 5].map((value, index) =>
                            <Row padding={[5]} key={"Pricce_range_" + index}>
                                <Column md={1} xs={1} sm={1} padding={[2]}><Skeleton variant="rect" className={classes.skelition} /></Column>
                                <Column md={11} xs={11} sm={11} padding={[2]}><Skeleton variant="rect" className={classes.skelition} /></Column>
                            </Row>)
                    }
                </Column>
                <Column padding={[5]}><Skeleton variant="rect" className={classes.skelition} /></Column>
                <Column padding={[5]}>
                    {
                        [1, 2, 3, 4, 5, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5].map((value, index) =>
                            <Row padding={[5]} key={"ammunity_" + index}>
                                <Column md={1} xs={1} sm={1} padding={[2]}><Skeleton variant="rect" className={classes.skelition} /></Column>
                                <Column md={11} xs={11} sm={11} padding={[2]}><Skeleton variant="rect" className={classes.skelition} /></Column>
                            </Row>)
                    }
                </Column>
            </Row>
        </Card>
    )
}