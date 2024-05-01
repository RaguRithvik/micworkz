import React from 'react';
import dynamic from 'next/dynamic';
import PageLoader from '../../../@jumbo/components/PageComponents/PageLoader';
import SecurePage from '../../../authentication/auth-page-wrappers/SecurePage';

const HotelSetup = dynamic(() => import('../../../components/HotelsSetup/HotelSetup'), {
  loading: () => <PageLoader />,
});

const HotelSetupCommonPage = () => (
  <SecurePage>
    <HotelSetup/>
  </SecurePage>
);

export default HotelSetupCommonPage;
