import React from 'react';
import dynamic from 'next/dynamic';
import PageLoader from '../../../@jumbo/components/PageComponents/PageLoader';
import SecurePage from '../../../authentication/auth-page-wrappers/SecurePage';

const LedgerCummulativeSummary = dynamic(() => import('../../../components/Report/Ledger_Cummulative_Summary'), {
  loading: () => <PageLoader />,
});

const LedgerCummulativeSummaryPage = () => (
  <SecurePage>
    <LedgerCummulativeSummary />
  </SecurePage>
);

export default LedgerCummulativeSummaryPage;
