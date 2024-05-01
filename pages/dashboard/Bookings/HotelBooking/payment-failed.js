import React from 'react';
import dynamic from 'next/dynamic';
import PageLoader from '../../../../@jumbo/components/PageComponents/PageLoader';
import SecurePage from '../../../../authentication/auth-page-wrappers/SecurePage';

const Fail = dynamic(() => import('../../../../components/Payment/fail'), {
  loading: () => <PageLoader />,
});

const PayFail = () => (
  <SecurePage>
      <Fail/>
  </SecurePage>
);

export default PayFail;
