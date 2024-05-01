import React from 'react';
import dynamic from 'next/dynamic';
import PageLoader from '../../../@jumbo/components/PageComponents/PageLoader';
import SecurePage from '../../../authentication/auth-page-wrappers/SecurePage';

const RoomPriceComment = dynamic(() => import('../../../components/Hotel/RoomPriceComment'), {
  loading: () => <PageLoader />,
});

const RoomPriceCommentPage = () => (
  <SecurePage>
    <RoomPriceComment />
  </SecurePage>
);

export default RoomPriceCommentPage;
