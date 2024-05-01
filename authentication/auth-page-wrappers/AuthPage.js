import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../index';
import PageLoader from '../../@jumbo/components/PageComponents/PageLoader';

// eslint-disable-next-line react/prop-types
const AuthPage = ({ children }) => {
  const { loadingAuthUser, authUser, setError } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loadingAuthUser && authUser && authUser.is_completed) {
      router.push('/dashboard/').then((r) => r);
    } else if (!loadingAuthUser && authUser && !authUser.is_completed) {
      router.push('/dashboard/profile').then((r) => r);
    }
    return () => setError('');
  }, [authUser, loadingAuthUser]);

  return authUser && loadingAuthUser ? <PageLoader /> : children;
};

export default AuthPage;
