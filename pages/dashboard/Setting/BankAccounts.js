import React from 'react';
import dynamic from 'next/dynamic';
import PageLoader from '../../../@jumbo/components/PageComponents/PageLoader';
import SecurePage from '../../../authentication/auth-page-wrappers/SecurePage'; 

const BankAccounts = dynamic(() => import('../../../components/Setting/BankAccounts'), {
  loading: () => <PageLoader />,
});

const BankAccountsPage = () => (
  <SecurePage> 
      <BankAccounts/>
  </SecurePage>
);

export default BankAccountsPage;
