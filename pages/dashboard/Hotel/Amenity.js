import React from 'react';
import dynamic from 'next/dynamic';
import PageLoader from '../../../@jumbo/components/PageComponents/PageLoader';
import SecurePage from '../../../authentication/auth-page-wrappers/SecurePage';

const Amenity = dynamic(() => import('../../../components/Hotel/Amenity'), {
  loading: () => <PageLoader />,
});

const AmenityMaster = () => (
  <SecurePage>
    <Amenity />
  </SecurePage>
);

export default AmenityMaster;
