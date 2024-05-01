import React from 'react';
import dynamic from 'next/dynamic';
import PageLoader from '../../../@jumbo/components/PageComponents/PageLoader';
import SecurePage from '../../../authentication/auth-page-wrappers/SecurePage';

const TicektPriceComments = dynamic(() => import('../../../components/Attractions/TicketPriceComments'), {
  loading: () => <PageLoader />,
});

const TicektPriceCommentsPage = () => (
  <SecurePage>
    <TicektPriceComments />
  </SecurePage>
);

export default TicektPriceCommentsPage;
