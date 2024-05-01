import React from 'react';
import { CryptoCard } from '../../../@jumbo/components/Common';
import RippleGraph from './RippleGraph';
import {Card} from "../../../core";

const RipplePurchaseHistory = () => {
  return (
    <Card   progress={{ value: '', icon: 'info', color: '' }} padding={[20,0,0,0]}>
      <RippleGraph />
    </Card>
  );
};

export default RipplePurchaseHistory;
