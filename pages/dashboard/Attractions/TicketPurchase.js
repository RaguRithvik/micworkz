import React from 'react';
import dynamic from 'next/dynamic';
import PageLoader from '../../../@jumbo/components/PageComponents/PageLoader';
import SecurePage from '../../../authentication/auth-page-wrappers/SecurePage';

const TicektPurchase = dynamic(() => import('../../../components/Attractions/TicketPurchase'), {
  loading: () => <PageLoader />,
});

const TicektPurchasePage = () => (
  <SecurePage>
    <TicektPurchase />
  </SecurePage>
);

export default TicektPurchasePage;
