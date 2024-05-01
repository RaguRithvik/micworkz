import React from 'react';
import dynamic from 'next/dynamic';
import PageLoader from '../../../@jumbo/components/PageComponents/PageLoader';
import SecurePage from '../../../authentication/auth-page-wrappers/SecurePage';

const BankMaster = dynamic(() => import('../../../components/Accounts/BankMaster'), {
  loading: () => <PageLoader />,
});

const BankMasterPage = () => (
  <SecurePage>
    <BankMaster />
  </SecurePage>
);

export default BankMasterPage;
