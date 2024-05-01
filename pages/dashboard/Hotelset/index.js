import React from 'react';
import dynamic from 'next/dynamic';
import PageLoader from '../../../@jumbo/components/PageComponents/PageLoader';
import SecurePage from '../../../authentication/auth-page-wrappers/SecurePage';

const Hotelset = dynamic(() => import('../../../components/Hotelset/index'), {
  loading: () => <PageLoader />,
});

const ManageHotelset = () => (
  <SecurePage>
      <Hotelset/>
  </SecurePage>
);

export default ManageHotelset;
