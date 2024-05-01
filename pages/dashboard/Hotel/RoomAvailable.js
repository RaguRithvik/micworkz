import React from 'react';
import dynamic from 'next/dynamic';
import PageLoader from '../../../@jumbo/components/PageComponents/PageLoader';
import SecurePage from '../../../authentication/auth-page-wrappers/SecurePage';

const RoomAvailable = dynamic(() => import('../../../components/Hotel/RoomAvailable'), {
  loading: () => <PageLoader />,
});

const RoomAvailablePage = () => (
  <SecurePage>
    <RoomAvailable />
  </SecurePage>
);

export default RoomAvailablePage;
