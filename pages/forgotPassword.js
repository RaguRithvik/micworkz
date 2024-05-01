import React from 'react';
import dynamic from 'next/dynamic';
import PageLoader from '../@jumbo/components/PageComponents/PageLoader';
import AuthPage from '../authentication/auth-page-wrappers/AuthPage';

const ForgotPassword = dynamic(() => import('../components/Auth/ForgotPassword'), {
  loading: () => <PageLoader />,
});

const ForgotPasswordPage = () => (
  <AuthPage>
    <ForgotPassword variant="standard" wrapperVariant="bgColor" />
  </AuthPage>
);

export default ForgotPasswordPage;
