"use client";

import { ComponentType, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useRouter } from "next/navigation";
import Loading from "@/components/Loading";
import { isAdminUser } from "@/utils/auth";

const withAuth = <P extends object>(Component: ComponentType<P>) => {
  return function AuthenticatedComponent(props: P) {
    const { isAuthenticated, isLoading, user } = useAuth0();
    const router = useRouter();

    useEffect(() => {
      if (!isLoading) {
        if (!isAuthenticated) {
          router.push("/login");
        } else if (isAuthenticated && !isAdminUser(user)) {
          router.push("/unauthorized");
        }
      }
    }, [isLoading, isAuthenticated, user, router]);

    if (isLoading) return <Loading />;
    return <Component {...props} />;
  };
};

export default withAuth;
