"use client";
import Navigation from "@/components/Navigation";
import { usePathname } from "next/navigation";

export default function PathnameWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <>
      {!pathname.startsWith("/login") && <Navigation />}
      {children}
    </>
  );
}
