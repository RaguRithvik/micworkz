import React from 'react';
import dynamic from 'next/dynamic';
import PageLoader from '../../../@jumbo/components/PageComponents/PageLoader';
import SecurePage from '../../../authentication/auth-page-wrappers/SecurePage';

const Ticket = dynamic(() => import('../../../components/Attractions/index'), {
  loading: () => <PageLoader />,
});

const TicketPage = () => (
  <SecurePage>
      <Ticket/>
  </SecurePage>
);

export default TicketPage;
