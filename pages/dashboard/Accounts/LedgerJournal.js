import React from 'react';
import dynamic from 'next/dynamic';
import PageLoader from '../../../@jumbo/components/PageComponents/PageLoader';
import SecurePage from '../../../authentication/auth-page-wrappers/SecurePage';

const LedgerJournal = dynamic(() => import('../../../components/Accounts/LedgerJournal'), {
  loading: () => <PageLoader />,
});

const LedgerJournalPage = () => (
  <SecurePage>
    <LedgerJournal />
  </SecurePage>
);

export default LedgerJournalPage;
