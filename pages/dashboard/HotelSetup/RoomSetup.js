import React from 'react';
import dynamic from 'next/dynamic';
import PageLoader from '../../../@jumbo/components/PageComponents/PageLoader';
import SecurePage from '../../../authentication/auth-page-wrappers/SecurePage';

const RoomSetup = dynamic(() => import('../../../components/HotelSetup/RoomSetup'), {
  loading: () => <PageLoader />,
});

const RoomSetupPage = () => (
  <SecurePage>
    <RoomSetup />
  </SecurePage>
);

export default RoomSetupPage;
