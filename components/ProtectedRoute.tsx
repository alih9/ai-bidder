"use client";

import { useAuth0 } from "@auth0/auth0-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loading } from "@/components";
import { isAdminUser } from "@/utils/auth";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading, user } = useAuth0();

  const router = useRouter();
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !isAdminUser(user))) {
      router.push("/login");
    } else if (!isLoading && isAuthenticated) {
      setIsVerified(true);
    }
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading || !isVerified) {
    return <Loading />;
  }

  return <>{children}</>;
}
