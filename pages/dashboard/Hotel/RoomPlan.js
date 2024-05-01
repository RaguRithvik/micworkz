import React from 'react';
import dynamic from 'next/dynamic';
import PageLoader from '../../../@jumbo/components/PageComponents/PageLoader';
import SecurePage from '../../../authentication/auth-page-wrappers/SecurePage';

const RoomPlan = dynamic(() => import('../../../components/Hotel/RoomPlan'), {
  loading: () => <PageLoader />,
});

const RoomPlanPage = () => (
  <SecurePage>
    <RoomPlan />
  </SecurePage>
);

export default RoomPlanPage;
