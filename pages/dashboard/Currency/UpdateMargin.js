import React from 'react';
import dynamic from 'next/dynamic';
import PageLoader from '../../../@jumbo/components/PageComponents/PageLoader';
import SecurePage from '../../../authentication/auth-page-wrappers/SecurePage';

const UpdateMargin = dynamic(() => import('../../../components/Currency/UpdateMargin'), {
  loading: () => <PageLoader />,
});

const UpdateMarginPage = () => (
  <SecurePage>
      <UpdateMargin/>
  </SecurePage>
);

export default UpdateMarginPage;
