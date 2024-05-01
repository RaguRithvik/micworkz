import React from 'react';
import dynamic from 'next/dynamic';
import PageLoader from '../../../@jumbo/components/PageComponents/PageLoader';
import SecurePage from '../../../authentication/auth-page-wrappers/SecurePage';

const User = dynamic(() => import('../../../components/User/UserCreation'), {
  loading: () => <PageLoader />,
});

const UserCreation = () => (
  <SecurePage>
    <User />
  </SecurePage>
);

export default UserCreation;
