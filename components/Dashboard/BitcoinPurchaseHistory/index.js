import React from 'react';
import { CryptoCard } from '../../../@jumbo/components/Common';
import BitcoinGraph from './BitcoinGraph';
import LanguageConfig from "../../../helper/LanguageConfig"
 
const BitcoinPurchaseHistory = () => {
  return (
    <CryptoCard title={<LanguageConfig id="dashboardpage.totalsaletodate" />} amount="&yen; 9,626" progress={{ value: '23%', icon: 'info', color: '#8DCD03' }}>
      <BitcoinGraph />
    </CryptoCard>
  );
};

export default BitcoinPurchaseHistory;
