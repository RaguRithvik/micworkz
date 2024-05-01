import React from 'react';
import dynamic from 'next/dynamic';
import PageLoader from '../../../../@jumbo/components/PageComponents/PageLoader';
import SecurePage from '../../../../authentication/auth-page-wrappers/SecurePage';

const Success = dynamic(() => import('../../../../components/Payment/success'), {
  loading: () => <PageLoader />,
});

const PaySuccess = () => (
  <SecurePage>
    <Success />
  </SecurePage>
);

export default PaySuccess;
