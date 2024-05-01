import React from 'react';
import dynamic from 'next/dynamic';
import PageLoader from '../../../@jumbo/components/PageComponents/PageLoader';
import SecurePage from '../../../authentication/auth-page-wrappers/SecurePage';

const LedgerCummulativeModule = dynamic(() => import('../../../components/Report/Ledger_Cummulative'), {
  loading: () => <PageLoader />,
});

const LedgerCummulativePage = () => (
  <SecurePage>
    <LedgerCummulativeModule />
  </SecurePage>
);

export default LedgerCummulativePage;
