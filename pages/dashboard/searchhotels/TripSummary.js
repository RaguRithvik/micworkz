import React,{useEffect} from 'react';
import dynamic from 'next/dynamic';
import PageLoader from '../../../@jumbo/components/PageComponents/PageLoader';
import SecurePage from '../../../authentication/auth-page-wrappers/SecurePage';
import SearchBar from "../../../components/search/SearchBar";
import { useStore } from '../../../helper/Store';

const Summary = dynamic(() => import('../../../components/TripSummary'), {
  loading: () => <PageLoader />,
});

const TripSummary = () =>{
  const { setHeaderConfig } = useStore()
  useEffect(() => {
      setHeaderConfig(<SearchBar />)
      return () => {
       setHeaderConfig(null);
      }
  }, [])
   return (
  <SecurePage> 
      <Summary/>
  </SecurePage>
)
};

export default TripSummary;
