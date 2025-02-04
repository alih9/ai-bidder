import "./globals.css";
import type { Metadata } from "next";
import Auth0ProviderWrapper from "./Auth0ProviderWrapper";

export const metadata: Metadata = {
  title: "AI-Bidder",
  description: "Generate winning proposals with AI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Auth0ProviderWrapper>{children}</Auth0ProviderWrapper>
      </body>
    </html>
  );
}
