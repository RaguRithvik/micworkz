import React from 'react';
import dynamic from 'next/dynamic';
import PageLoader from '../../../@jumbo/components/PageComponents/PageLoader';
import SecurePage from '../../../authentication/auth-page-wrappers/SecurePage';

const Tag = dynamic(() => import('../../../components/Hotel/HotelTag'), {
  loading: () => <PageLoader />,
});

const HotelTag = () => (
  <SecurePage>
    <Tag />
  </SecurePage>
);

export default HotelTag;
