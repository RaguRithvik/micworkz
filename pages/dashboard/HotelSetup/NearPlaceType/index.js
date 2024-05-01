import React from 'react';
import dynamic from 'next/dynamic';
import PageLoader from '../../../../@jumbo/components/PageComponents/PageLoader';
import SecurePage from '../../../../authentication/auth-page-wrappers/SecurePage';

const NearPlaceType = dynamic(() => import('../../../../components/HotelSetup/NearPlaceType'), {
  loading: () => <PageLoader />,
});

const NearPlaceTypePage = () => (
  <SecurePage>
    <NearPlaceType />
  </SecurePage>
);

export default NearPlaceTypePage;
