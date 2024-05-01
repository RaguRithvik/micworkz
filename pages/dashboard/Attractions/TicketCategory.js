import React from 'react';
import dynamic from 'next/dynamic';
import PageLoader from '../../../@jumbo/components/PageComponents/PageLoader';
import SecurePage from '../../../authentication/auth-page-wrappers/SecurePage';

const TicketCategory = dynamic(() => import('../../../components/Attractions/TicketCategory'), {
  loading: () => <PageLoader />,
});

const TicketCategoryPage = () => (
  <SecurePage>
    <TicketCategory />
  </SecurePage>
);

export default TicketCategoryPage;
