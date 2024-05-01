import React from 'react';
import dynamic from 'next/dynamic';
import PageLoader from '../../../@jumbo/components/PageComponents/PageLoader';
import SecurePage from '../../../authentication/auth-page-wrappers/SecurePage'; 

const LedgerJournals = dynamic(() => import('../../../components/Setting/LedgerJournals'), {
  loading: () => <PageLoader />,
});

const LedgerJournalsPage = () => (
  <SecurePage> 
      <LedgerJournals/>
  </SecurePage>
);

export default LedgerJournalsPage;
