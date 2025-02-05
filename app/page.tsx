"use client";

import { Loading } from "@/components";
import ProposalPage from "@/components/Proposal";
import withAuth from "@/components/withAuth";
import { useAuth0 } from "@auth0/auth0-react";

const HomePage = () => {
  const { isAuthenticated } = useAuth0();
  return <>{isAuthenticated ? <ProposalPage /> : <Loading />}</>;
};

export default withAuth(HomePage);
