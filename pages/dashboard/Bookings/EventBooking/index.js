import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';
import PageLoader from '../../../../@jumbo/components/PageComponents/PageLoader';
import SecurePage from '../../../../authentication/auth-page-wrappers/SecurePage';
import SearchBar from '../../../../components/Bookings/EventBooking/SearchEvent';
import { useStore } from '../../../../helper/Store';

const Search = dynamic(() => import('../../../../components/Bookings/EventBooking/index'), {
  loading: () => <PageLoader />,
});

const SearchEvents = () => {
  const { setHeaderConfig } = useStore();
  useEffect(() => {
    setHeaderConfig(<SearchBar />);
    return () => {
      setHeaderConfig(null);
    };
  }, []);

  return (
    <SecurePage>
      <Search />
    </SecurePage>
  );
};

export default SearchEvents;
