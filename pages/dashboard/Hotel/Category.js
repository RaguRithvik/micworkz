import React from 'react';
import dynamic from 'next/dynamic';
import PageLoader from '../../../@jumbo/components/PageComponents/PageLoader';
import SecurePage from '../../../authentication/auth-page-wrappers/SecurePage';

const Category = dynamic(() => import('../../../components/Hotel/Category'), {
  loading: () => <PageLoader />,
});

const HotelCategory = () => (
  <SecurePage>
    <Category />
  </SecurePage>
);

export default HotelCategory;
