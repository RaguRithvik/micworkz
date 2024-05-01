import React from 'react';
import dynamic from 'next/dynamic';
import PageLoader from '../../../@jumbo/components/PageComponents/PageLoader';
import SecurePage from '../../../authentication/auth-page-wrappers/SecurePage'; 

const LedgerGroup = dynamic(() => import('../../../components/Setting/LedgerGroup'), {
  loading: () => <PageLoader />,
});

const LedgerGroupPage = () => (
  <SecurePage> 
      <LedgerGroup/>
  </SecurePage>
);

export default LedgerGroupPage;
