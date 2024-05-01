import React, { useState } from 'react';
import { CurrencyCalculator } from '../../../@jumbo/components/Common';
import makeStyles from '@material-ui/core/styles/makeStyles';

const currencies = [
  {
    name: 'USD',
    code: 'usd',
  },
  {
    name: 'INR',
    code: 'inr',
  },
  {
    name: 'EURO',
    code: 'euro',
  },
];

const currencyRates = {
  'usd-inr': 74,
  'inr-usd': 0.0135,
  'usd-euro': 0.89,
  'euro-usd': 1.13,
  'inr-euro': 0.0117,
  'euro-inr': 85,
};

const useStyles = makeStyles((theme) => ({
  cardRoot: {
    display: 'flex',
    flexDirection: 'column',
    '& .Cmt-card-content': {
      [theme.breakpoints.up('md')]: {
        paddingTop: 16,
      },
    },
  },
}));

const Calculator = () => {
  const classes = useStyles();
  const defaultCalculation = {
    amountToConvert: 0,
    rate: 0,
    value: '0.00',
    convertFrom: currencies[0],
    convertTo: currencies[1],
  };

  const [calculatedValue, setCalculatedValue] = useState(defaultCalculation);

  const setCalculation = (to, from, amount) => {
    const rate = getRate(from.code, to.code);

    setCalculatedValue({
      amountToConvert: amount,
      convertFrom: from,
      convertTo: to,
      rate: rate,
      value: (amount * rate).toFixed(2),
    });
  };

  const getRate = (fromCode, toCode) => {
    const currencyRate = currencyRates[`${fromCode}-${toCode}`];
    return currencyRate > 0 ? currencyRate : 1;
  };

  const handleCalculation = (to, from, amount) => {
    setCalculation(to, from, amount);
  };

  const handleResetCalculator = () => {
    setCalculation(calculatedValue.convertTo, calculatedValue.convertFrom, 0);
  };

  return (
    <CurrencyCalculator
      className={classes.cardRoot}
      title="Currency Calculator"
      calculatedValue={calculatedValue}
      onReset={handleResetCalculator}
      onCalculate={handleCalculation}
      currencies={currencies}
    />
  );
};

export default Calculator;
