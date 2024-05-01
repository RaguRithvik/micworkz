import React from 'react';
import dynamic from 'next/dynamic';
import PageLoader from '../../../@jumbo/components/PageComponents/PageLoader';
import SecurePage from '../../../authentication/auth-page-wrappers/SecurePage';

const ModeOfPay = dynamic(() => import('../../../components/Accounts/ModeOfPay'), {
  loading: () => <PageLoader />,
});

const ModeOfPayPage = () => (
  <SecurePage>
    <ModeOfPay />
  </SecurePage>
);

export default ModeOfPayPage;
