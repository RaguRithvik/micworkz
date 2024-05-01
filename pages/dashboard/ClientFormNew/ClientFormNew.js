import React from 'react';
import dynamic from 'next/dynamic';
import PageLoader from '../../../@jumbo/components/PageComponents/PageLoader';
import SecurePage from '../../../authentication/auth-page-wrappers/SecurePage';

const ClientFormNew = dynamic(() => import('../../../components/ClientFormNew/ClientFormNew'), {
  loading: () => <PageLoader />,
});

const ClientFormNewPage = () => (
  <SecurePage>
    <ClientFormNew />
  </SecurePage>
);

export default ClientFormNewPage;
