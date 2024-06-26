import React from 'react';
import dynamic from 'next/dynamic';
import PageLoader from '../../../@jumbo/components/PageComponents/PageLoader';
import SecurePage from '../../../authentication/auth-page-wrappers/SecurePage';

const Issues = dynamic(() => import('../../../components/Hotel/Issues'), {
  loading: () => <PageLoader />,
});

const HotelIssues = () => (
  <SecurePage>
    <Issues />
  </SecurePage>
);

export default HotelIssues;
