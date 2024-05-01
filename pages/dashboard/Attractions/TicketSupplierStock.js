import React from 'react';
import dynamic from 'next/dynamic';
import PageLoader from '../../../@jumbo/components/PageComponents/PageLoader';
import SecurePage from '../../../authentication/auth-page-wrappers/SecurePage';

const TicketSupplierStock = dynamic(() => import('../../../components/Attractions/SupplierStock'), {
  loading: () => <PageLoader />,
});

const TicketSupplierStockPage = () => (
  <SecurePage>
    <TicketSupplierStock />
  </SecurePage>
);

export default TicketSupplierStockPage;
