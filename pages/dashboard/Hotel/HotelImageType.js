import React from 'react';
import dynamic from 'next/dynamic';
import PageLoader from '../../../@jumbo/components/PageComponents/PageLoader';
import SecurePage from '../../../authentication/auth-page-wrappers/SecurePage';

const ImageType = dynamic(() => import('../../../components/Hotel/ImageType'), {
  loading: () => <PageLoader />,
});

const HotelImageType = () => (
  <SecurePage>
    <ImageType />
  </SecurePage>
);

export default HotelImageType;
