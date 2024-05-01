import React from 'react';
import dynamic from 'next/dynamic';
import PageLoader from '../../../@jumbo/components/PageComponents/PageLoader';
import SecurePage from '../../../authentication/auth-page-wrappers/SecurePage';

const ClientForm = dynamic(() => import('../../../components/ClientForm/ClientForm'), {
  loading: () => <PageLoader />,
});

const ClientFormPage = () => (
  <SecurePage>
    <ClientForm />
  </SecurePage>
);

export default ClientFormPage;
