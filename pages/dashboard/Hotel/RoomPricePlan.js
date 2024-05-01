import React from 'react';
import dynamic from 'next/dynamic';
import PageLoader from '../../../@jumbo/components/PageComponents/PageLoader';
import SecurePage from '../../../authentication/auth-page-wrappers/SecurePage';

const RoomPricePlan = dynamic(() => import('../../../components/Hotel/RoomPricePlan'), {
  loading: () => <PageLoader />,
});

const RoomPricePlanPage = () => (
  <SecurePage>
    <RoomPricePlan />
  </SecurePage>
);

export default RoomPricePlanPage;
