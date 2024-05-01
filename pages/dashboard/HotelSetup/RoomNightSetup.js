import React from 'react';
import dynamic from 'next/dynamic';
import PageLoader from '../../../@jumbo/components/PageComponents/PageLoader';
import SecurePage from '../../../authentication/auth-page-wrappers/SecurePage';

const RoomNightSetup = dynamic(() => import('../../../components/HotelSetup/RoomNightSetup'), {
  loading: () => <PageLoader />,
});

const RoomNightSetupPage = () => (
  <SecurePage>
    <RoomNightSetup />
  </SecurePage>
);

export default RoomNightSetupPage;
