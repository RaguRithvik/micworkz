import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';
import PageLoader from '../../../../@jumbo/components/PageComponents/PageLoader';
import SecurePage from '../../../../authentication/auth-page-wrappers/SecurePage';
import SearchBar from '../../../../components/Bookings/EventBooking/SearchEvent';
import { useStore } from '../../../../helper/Store';

const EventCheckout = dynamic(() => import('../../../../components/Bookings/EventBooking/EventRates/EventCheckout'), {
  loading: () => <PageLoader />,
});

const EventCheckoutPage = () => {
  const { setHeaderConfig } = useStore();
  useEffect(() => {
    setHeaderConfig(<SearchBar />);
    return () => {
      setHeaderConfig(null);
    };
  }, []);
  return (
    <SecurePage>
      <EventCheckout />
    </SecurePage>
  );
};

export default EventCheckoutPage;
