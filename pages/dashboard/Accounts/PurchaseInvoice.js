import React from 'react';
import dynamic from 'next/dynamic';
import PageLoader from '../../../@jumbo/components/PageComponents/PageLoader';
import SecurePage from '../../../authentication/auth-page-wrappers/SecurePage';

const PurchaseInvoice = dynamic(() => import('../../../components/Accounts/PurchaseInvoice'), {
  loading: () => <PageLoader />,
});

const PurchaseInvoicePage = () => (
  <SecurePage>
    <PurchaseInvoice />
  </SecurePage>
);

export default PurchaseInvoicePage;
