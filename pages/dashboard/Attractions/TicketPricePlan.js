import React from 'react';
import dynamic from 'next/dynamic';
import PageLoader from '../../../@jumbo/components/PageComponents/PageLoader';
import SecurePage from '../../../authentication/auth-page-wrappers/SecurePage';

const TicektPricePlan = dynamic(() => import('../../../components/Attractions/TicketPricePlan'), {
  loading: () => <PageLoader />,
});

const TicektPricePlanPage = () => (
  <SecurePage>
    <TicektPricePlan />
  </SecurePage>
);

export default TicektPricePlanPage;
