import React from 'react';
import { CryptoCard } from '../../../@jumbo/components/Common';
import LitecoinGraph from './LitecoinGraph';
import LanguageConfig from "../../../helper/LanguageConfig"

const LitecoinPurchaseHistory = () => {
  return (
    <CryptoCard title={<LanguageConfig id="dashboardpage.totalsalestoday" />} amount="&yen; 9,626" progress={{ value: '-1.4%', icon: 'info', color: '#E00930' }}>
      <LitecoinGraph />
    </CryptoCard>
  );
};

export default LitecoinPurchaseHistory;
