import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';
import PageLoader from '../../../../@jumbo/components/PageComponents/PageLoader';
import SecurePage from '../../../../authentication/auth-page-wrappers/SecurePage';
import SearchBar from '../../../../components/Bookings/EventBooking/SearchEvent';
import { useStore } from '../../../../helper/Store';

const EventRates = dynamic(() => import('../../../../components/Bookings/EventBooking/EventRates/index'), {
  loading: () => <PageLoader />,
});

const EventRatesPage = () => {
  const { setHeaderConfig } = useStore();
  useEffect(() => {
    setHeaderConfig(<SearchBar />);
    return () => {
      setHeaderConfig(null);
    };
  }, []);
  return (
    <SecurePage>
      <EventRates />
    </SecurePage>
  );
};

export default EventRatesPage;
