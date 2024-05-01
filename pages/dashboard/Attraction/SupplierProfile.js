import React from 'react';
import dynamic from 'next/dynamic';
import PageLoader from '../../../@jumbo/components/PageComponents/PageLoader';
import SecurePage from '../../../authentication/auth-page-wrappers/SecurePage';

const SupplierProfile = dynamic(() => import('../../../components/SupplierProfile/index'), {
  loading: () => <PageLoader />,
});

const SupplierProfilePage = () => (
  <SecurePage>
      <SupplierProfile/>
  </SecurePage>
);

export default SupplierProfilePage;
