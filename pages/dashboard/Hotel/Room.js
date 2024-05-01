import React from 'react';
import dynamic from 'next/dynamic';
import PageLoader from '../../../@jumbo/components/PageComponents/PageLoader';
import SecurePage from '../../../authentication/auth-page-wrappers/SecurePage';

const Index = dynamic(() => import('../../../components/Hotel/Room'), {
  loading: () => <PageLoader />,
});

const ManageRoom = () => (
  <SecurePage>
    <Index />
  </SecurePage>
);

export default ManageRoom;
