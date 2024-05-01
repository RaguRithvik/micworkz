import React from 'react';
import dynamic from 'next/dynamic';
import PageLoader from '../../../@jumbo/components/PageComponents/PageLoader';
import SecurePage from '../../../authentication/auth-page-wrappers/SecurePage';

const AttractionSalesReport = dynamic(() => import('../../../components/Report/AttractionSalesReport'), {
  loading: () => <PageLoader />,
});

const SalesReportPage = () => (
  <SecurePage>
    <AttractionSalesReport />
  </SecurePage>
);

export default SalesReportPage;
