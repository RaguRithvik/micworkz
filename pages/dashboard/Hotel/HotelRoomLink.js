import React from 'react';
import dynamic from 'next/dynamic';
import PageLoader from '../../../@jumbo/components/PageComponents/PageLoader';
import SecurePage from '../../../authentication/auth-page-wrappers/SecurePage';

const HotelRoomLink = dynamic(() => import('../../../components/Hotel/HotelRoomLink'), {
  loading: () => <PageLoader />,
});

const HotelRoomLinkPage = () => (
  <SecurePage>
    <HotelRoomLink />
  </SecurePage>
);

export default HotelRoomLinkPage;
