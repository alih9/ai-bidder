"use client";

import Proposal from "@/components/Proposal";
import withAuth from "@/components/withAuth";

const ProposalPage = () => {
  return <Proposal />;
};

export default withAuth(ProposalPage);
