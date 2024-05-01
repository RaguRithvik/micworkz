import { useEffect, useState } from 'react';

export const useProvideAuth = () => {
  const [loadingAuthUser, setLoadingAuthUser] = useState(true);
  const [authUser, setAuthUser] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userBranch, setUserBranch] = useState({ show: false, value: null });

  const fetchStart = () => {
    setLoading(true);
    setError('');
  };

  const fetchSuccess = () => {
    setLoading(false);
    setError('');
  };

  const fetchError = (error) => {
    setLoading(false);
    setError(error);
  };

  const userLogin = (user, callbackFun) => {
    try {
      fetchStart();
      setTimeout(() => {
        fetchSuccess();
        localStorage.setItem('user', JSON.stringify(user));
        setAuthUser(user);
        if (callbackFun) callbackFun();
      }, 300);
    } catch (error) {
      fetchError(error.message);
    }
  };

  const userSignup = (user, callbackFun) => {
    try {
      fetchStart();
      setTimeout(() => {
        fetchSuccess();
        localStorage.setItem('user', JSON.stringify({ ...user, name: 'Admin' }));
        setAuthUser({ ...user, name: 'Admin' });
        if (callbackFun) callbackFun();
      }, 300);
    } catch (error) {
      fetchError(error.message);
    }
  };

  const sendPasswordResetEmail = (email, callbackFun) => {
    try {
      fetchStart();
      setTimeout(() => {
        fetchSuccess();
        if (callbackFun) callbackFun();
      }, 300);
    } catch (error) {
      fetchError(error.message);
    }
  };

  const confirmPasswordReset = (code, password, callbackFun) => {
    try {
      fetchStart();
      setTimeout(() => {
        fetchSuccess();
        if (callbackFun) callbackFun();
      }, 300);
    } catch (error) {
      fetchError(error.message);
    }
  };

  const renderSocialMediaLogin = () => null;

  const userSignOut = (callbackFun) => {
    try {
      fetchStart();
      setTimeout(() => {
        fetchSuccess();
        clearStorage();
        setAuthUser(false);
        setUserBranch(null);
        if (callbackFun) callbackFun();
      }, 300);
    } catch (error) {
      fetchError(error.message);
    }
  };

  const getAuthUser = () => {
    try {
      fetchStart();
      setTimeout(() => {
        fetchSuccess();
        setAuthUser(JSON.parse(localStorage.getItem('user')));
        setUserBranch(JSON.parse(localStorage.getItem('userbranch')));
      }, 300);
    } catch (error) {
      fetchError(error.message);
    }
  };

  const userBranchSelection = (branch) => {
    try {
      fetchStart();
      setTimeout(() => {
        fetchSuccess();
        localStorage.setItem('userbranch', JSON.stringify(branch));
        setUserBranch(branch);
      }, 300);
    } catch (error) {
      fetchError(error.message);
    }
  };

  const clearStorage = () => {
    try {
      console.log('razaa removing storage');
      localStorage.removeItem('user');
      localStorage.removeItem('userbranch');
      localStorage.removeItem('hotal-book-menus');
      localStorage.removeItem('hotal-book-active_language');
      localStorage.removeItem('hotal-book-languages');
      localStorage.removeItem('hotal-book-theme_language_config');
      localStorage.removeItem('ally-supports-cache');
    } catch (error) {
      fetchError(error.message);
    }
  };

  // Subscribe to user on mount
  // Because this sets state in the callback it will cause any ...
  // ... component that utilizes this hook to re-render with the ...
  // ... latest auth object.

  useEffect(() => {
    setTimeout(() => {
      fetchSuccess();
      setAuthUser(JSON.parse(localStorage.getItem('user')));
      setUserBranch(JSON.parse(localStorage.getItem('userbranch')));
      setLoadingAuthUser(false);
    }, 300);
  }, []);

  // Return the user object and auth methods
  return {
    loadingAuthUser,
    isLoading,
    authUser,
    userBranch,
    error,
    setError,
    setAuthUser,
    getAuthUser,
    userLogin,
    userSignup,
    userSignOut,
    renderSocialMediaLogin,
    sendPasswordResetEmail,
    confirmPasswordReset,
    userBranchSelection,
    setUserBranch,
    clearStorage
  };
};
