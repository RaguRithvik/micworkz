import React from 'react';
import dynamic from 'next/dynamic';
import PageLoader from '../../../@jumbo/components/PageComponents/PageLoader';
import SecurePage from '../../../authentication/auth-page-wrappers/SecurePage';

const Type = dynamic(() => import('../../../components/Hotel/AmenityType'), {
  loading: () => <PageLoader />,
});

const AmenityType = () => (
  <SecurePage>
      <Type/>
  </SecurePage>
);

export default AmenityType;
