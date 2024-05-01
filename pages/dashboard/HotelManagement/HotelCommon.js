import React from 'react';
import dynamic from 'next/dynamic';
import PageLoader from '../../../@jumbo/components/PageComponents/PageLoader';
import SecurePage from '../../../authentication/auth-page-wrappers/SecurePage';

const HotelCommon = dynamic(() => import('../../../components/HotelManagement/HotelCommon'), {
  loading: () => <PageLoader />,
});

const HotelCommonPage = () => (
  <SecurePage>
    <HotelCommon/>
  </SecurePage>
);

export default HotelCommonPage;
