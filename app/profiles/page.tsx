"use client";

import Profiles from "@/components/Profiles";
import withAuth from "@/components/withAuth";

const ProposalPage = () => {
  return <Profiles />;
};

export default withAuth(ProposalPage);
