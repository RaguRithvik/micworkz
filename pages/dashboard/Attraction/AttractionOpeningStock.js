import React from 'react';
import dynamic from 'next/dynamic';
import PageLoader from '../../../@jumbo/components/PageComponents/PageLoader';
import SecurePage from '../../../authentication/auth-page-wrappers/SecurePage';

const AttractionOpeningStock = dynamic(() => import('../../../components/AttractionOpeningStock/index'), {
  loading: () => <PageLoader />,
});

const AttractionOpening = () => (
  <SecurePage>
      <AttractionOpeningStock/>
  </SecurePage>
);

export default AttractionOpening;
