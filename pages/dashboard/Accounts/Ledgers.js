import React from 'react';
import dynamic from 'next/dynamic';
import PageLoader from '../../../@jumbo/components/PageComponents/PageLoader';
import SecurePage from '../../../authentication/auth-page-wrappers/SecurePage';

const Ledgers = dynamic(() => import('../../../components/Accounts/Ledgers'), {
  loading: () => <PageLoader />,
});

const LedgersPage = () => (
  <SecurePage>
    <Ledgers />
  </SecurePage>
);

export default LedgersPage;
