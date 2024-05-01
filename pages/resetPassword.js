import React from 'react';
import dynamic from 'next/dynamic';
import PageLoader from '../@jumbo/components/PageComponents/PageLoader';
import AuthPage from '../authentication/auth-page-wrappers/AuthPage';

const ResetPassword = dynamic(() => import('../components/Auth/ResetPassword'), {
  loading: () => <PageLoader />,
});

const SetPasswordPage = () => (
  <AuthPage>
    <ResetPassword variant="standard" wrapperVariant="bgColor" />
  </AuthPage>
);

export default SetPasswordPage;
