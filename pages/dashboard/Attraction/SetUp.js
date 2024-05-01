import React from 'react';
import dynamic from 'next/dynamic';
import PageLoader from '../../../@jumbo/components/PageComponents/PageLoader';
import SecurePage from '../../../authentication/auth-page-wrappers/SecurePage';

const Setup = dynamic(() => import('../../../components/setup/index'), {
  loading: () => <PageLoader />,
});

const SetUp = () => (
  <SecurePage>
      <Setup/>
  </SecurePage>
);

export default SetUp;
