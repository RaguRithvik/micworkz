import React from 'react';
import dynamic from 'next/dynamic';
import PageLoader from '../../../@jumbo/components/PageComponents/PageLoader';
import SecurePage from '../../../authentication/auth-page-wrappers/SecurePage';

const RoomTag = dynamic(() => import('../../../components/Hotel/RoomTag'), {
  loading: () => <PageLoader />,
});

const RoomTagPage = () => (
  <SecurePage>
    <RoomTag />
  </SecurePage>
);

export default RoomTagPage;
