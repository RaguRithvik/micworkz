import React from 'react';
import dynamic from 'next/dynamic';
import PageLoader from '../@jumbo/components/PageComponents/PageLoader';
import AuthPage from '../authentication/auth-page-wrappers/AuthPage';

const SetPassword = dynamic(() => import('../components/Auth/SetPassword'), {
  loading: () => <PageLoader />,
});

const SetPasswordPage = () => (
  <AuthPage>
    <SetPassword variant="standard" wrapperVariant="bgColor" />
  </AuthPage>
);

export default SetPasswordPage;
