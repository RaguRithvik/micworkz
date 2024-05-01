import React from 'react';
import dynamic from 'next/dynamic';
import PageLoader from '../../../../@jumbo/components/PageComponents/PageLoader';
import SecurePage from '../../../../authentication/auth-page-wrappers/SecurePage';

const NearPlace = dynamic(() => import('../../../../components/HotelSetup/NearPlace'), {
  loading: () => <PageLoader />,
});

const NearPlacePage = () => (
  <SecurePage>
    <NearPlace />
  </SecurePage>
);

export default NearPlacePage;
