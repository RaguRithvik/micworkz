import React from 'react';
import dynamic from 'next/dynamic';
import PageLoader from '../../@jumbo/components/PageComponents/PageLoader';
import SecurePage from '../../authentication/auth-page-wrappers/SecurePage';

const BranchSelection = dynamic(() => import('../../components/Auth/BranchSelection'), {
  loading: () => <PageLoader />,
});

const BranchSelectionPage = () => (
  <SecurePage>
    <BranchSelection variant="standard" wrapperVariant="bgColor" />
  </SecurePage>
);

export default BranchSelectionPage;
