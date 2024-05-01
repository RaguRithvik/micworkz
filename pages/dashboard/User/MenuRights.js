import React from 'react';
import dynamic from 'next/dynamic';
import PageLoader from '../../../@jumbo/components/PageComponents/PageLoader';
import SecurePage from '../../../authentication/auth-page-wrappers/SecurePage';

const User = dynamic(() => import('../../../components/User/MenuRights'), {
  loading: () => <PageLoader />,
});

const MenuRights = () => (
  <SecurePage>
    <User />
  </SecurePage>
);

export default MenuRights;
