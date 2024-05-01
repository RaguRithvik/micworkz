import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';
import PageLoader from '../../../../@jumbo/components/PageComponents/PageLoader';
import SecurePage from '../../../../authentication/auth-page-wrappers/SecurePage';
import SearchBar from '../../../../components/Bookings/HotelBooking/SearchBar';
import { useStore } from '../../../../helper/Store';

const Rooms = dynamic(() => import('../../../../components/Rooms'), {
  loading: () => <PageLoader />,
});

const HotelRooms = () => {
  const { setHeaderConfig } = useStore();
  useEffect(() => {
    setHeaderConfig(<SearchBar />);
    return () => {
      setHeaderConfig(null);
    };
  }, []);
  return (
    <SecurePage>
      <Rooms />
    </SecurePage>
  );
};

export default HotelRooms;
