import React from 'react';
import { CryptoCard } from '../../../@jumbo/components/Common';
import LanguageConfig from "../../../helper/LanguageConfig"
import EtheriumGraph from './EtheriumGraph';

const EtheriumPurchaseHistory = () => {
  return (
    <CryptoCard title={<LanguageConfig id="dashboardpage.totalsalesthismonth" />} amount="&yen; 9,626" progress={{ value: '0.7%', icon: 'info', color: '#8DCD03' }}>
      <EtheriumGraph />
    </CryptoCard>
  );
};

export default EtheriumPurchaseHistory;
