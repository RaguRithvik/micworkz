import React from "react"; 
import Dashboard from './dashboard/'; 
import SecurePage from '../authentication/auth-page-wrappers/SecurePage';

const HomePage = () => (
  <SecurePage>
    <Dashboard/>
  </SecurePage>
) ;

export default HomePage;
