import React from 'react';
import dynamic from 'next/dynamic';
import PageLoader from '../../../@jumbo/components/PageComponents/PageLoader';
import SecurePage from '../../../authentication/auth-page-wrappers/SecurePage';

const SellingPriceSetUp = dynamic(() => import('../../../components/SellingPriceSetUp/index'), {
  loading: () => <PageLoader />,
});

const SellingPriceSetUpPage = () => (
  <SecurePage>
      <SellingPriceSetUp/>
  </SecurePage>
);

export default SellingPriceSetUpPage;
