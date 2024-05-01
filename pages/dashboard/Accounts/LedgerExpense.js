import React from 'react';
import dynamic from 'next/dynamic';
import PageLoader from '../../../@jumbo/components/PageComponents/PageLoader';
import SecurePage from '../../../authentication/auth-page-wrappers/SecurePage';

const LedgerExpense = dynamic(() => import('../../../components/Accounts/LedgerExpense'), {
  loading: () => <PageLoader />,
});

const LedgerExpensePage = () => (
  <SecurePage>
    <LedgerExpense />
  </SecurePage>
);

export default LedgerExpensePage;
