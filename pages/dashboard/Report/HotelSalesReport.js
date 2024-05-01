import React from 'react';
import dynamic from 'next/dynamic';
import PageLoader from '../../../@jumbo/components/PageComponents/PageLoader';
import SecurePage from '../../../authentication/auth-page-wrappers/SecurePage';

const HotelSalesReport = dynamic(() => import('../../../components/Report/HotelSalesReport'), {
  loading: () => <PageLoader />,
});

const SalesReportPage = () => (
  <SecurePage>
    <HotelSalesReport />
  </SecurePage>
);

export default SalesReportPage;
