import React from 'react';
import dynamic from 'next/dynamic';
import PageLoader from '../../../@jumbo/components/PageComponents/PageLoader';
import SecurePage from '../../../authentication/auth-page-wrappers/SecurePage';

const TicektStock = dynamic(() => import('../../../components/Attractions/TicketStock'), {
  loading: () => <PageLoader />,
});

const TicektStockPage = () => (
  <SecurePage>
    <TicektStock />
  </SecurePage>
);

export default TicektStockPage;
