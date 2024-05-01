import React from 'react';
import { CryptoCard } from '../../../@jumbo/components/Common';
import RippleGraph from './RippleGraph';
import LanguageConfig from "../../../helper/LanguageConfig"

const RipplePurchaseHistory = () => { 
  return (
    <CryptoCard title={<LanguageConfig id="dashboardpage.totalsalethisyear" />} amount="&yen; 9,626" progress={{ value: '-8%', icon: 'info', color: '#E00930' }}>
      <RippleGraph />
    </CryptoCard>
  );
};

export default RipplePurchaseHistory;
