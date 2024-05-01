import React from 'react';
import dynamic from 'next/dynamic';
import PageLoader from '../../../@jumbo/components/PageComponents/PageLoader';
import SecurePage from '../../../authentication/auth-page-wrappers/SecurePage';

const Index = dynamic(() => import('../../../components/Events/ImageType'), {
  loading: () => <PageLoader />,
});

const ImageType = () => (
  <SecurePage>
    <Index />
  </SecurePage>
);

export default ImageType;
