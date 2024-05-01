import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';
import PageLoader from '../../../../@jumbo/components/PageComponents/PageLoader';
import SecurePage from '../../../../authentication/auth-page-wrappers/SecurePage';
import SearchBar from '../../../../components/Bookings/HotelBooking/SearchBar';
import { useStore } from '../../../../helper/Store';

const Search = dynamic(() => import('../../../../components/Bookings/HotelBooking/index'), {
  loading: () => <PageLoader />,
});

const SearchHotels = () => {
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

export default SearchHotels;
