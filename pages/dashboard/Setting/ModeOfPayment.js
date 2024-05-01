import React from 'react';
import dynamic from 'next/dynamic';
import PageLoader from '../../../@jumbo/components/PageComponents/PageLoader';
import SecurePage from '../../../authentication/auth-page-wrappers/SecurePage'; 

const ModeOfPayment = dynamic(() => import('../../../components/Setting/ModeOfPayment'), {
  loading: () => <PageLoader />,
});

const ModeOfPaymentPage = () => (
  <SecurePage> 
      <ModeOfPayment/>
  </SecurePage>
);

export default ModeOfPaymentPage;
