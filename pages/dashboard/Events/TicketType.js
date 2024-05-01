import React from 'react';
import dynamic from 'next/dynamic';
import PageLoader from '../../../@jumbo/components/PageComponents/PageLoader';
import SecurePage from '../../../authentication/auth-page-wrappers/SecurePage';

const TicketType = dynamic(() => import('../../../components/Events/TicketType'), {
  loading: () => <PageLoader />,
});

const TicketTypePage = () => (
  <SecurePage>
    <TicketType />
  </SecurePage>
);

export default TicketTypePage;
