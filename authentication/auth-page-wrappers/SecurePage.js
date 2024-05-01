import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../index';
import PageLoader from '../../@jumbo/components/PageComponents/PageLoader';

// eslint-disable-next-line react/prop-types
const SecurePage = ({ children }) => {
  const { loadingAuthUser, authUser, setError, userBranch } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!loadingAuthUser && !authUser) {
      router.push('/signin').then((r) => r);
    } else if (authUser && authUser.is_completed && userBranch && userBranch.show) {
      router.push('/dashboard/branch-selection').then((r) => r);
    } else if (authUser && !authUser.is_completed) {
      router.push('/dashboard/profile').then((r) => r);
    }

    return () => setError('');
  }, [authUser, loadingAuthUser]);

  return authUser && !loadingAuthUser ? children : <PageLoader />;
};

export default SecurePage;
