import React from 'react';
import dynamic from 'next/dynamic';
import PageLoader from '../../../@jumbo/components/PageComponents/PageLoader';
import SecurePage from '../../../authentication/auth-page-wrappers/SecurePage';

const TicketPlan = dynamic(() => import('../../../components/Attractions/TicketPlan'), {
  loading: () => <PageLoader />,
});

const TicketPlanPage = () => (
  <SecurePage>
    <TicketPlan />
  </SecurePage>
);

export default TicketPlanPage;
