import React from 'react';
import dynamic from 'next/dynamic';
import PageLoader from '../../@jumbo/components/PageComponents/PageLoader';
import SecurePage from '../../authentication/auth-page-wrappers/SecurePage';

const Dashboard = dynamic(() => import('../../components/Dashboard/index'), {
  loading: () => <PageLoader />,
});

const DashboardPage = () => (
  <SecurePage>
      <Dashboard/>
  </SecurePage>
);

export default DashboardPage;
