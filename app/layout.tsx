import "./globals.css";
import type { Metadata } from "next";
import Auth0ProviderWrapper from "./Auth0ProviderWrapper";
import PathnameWrapper from "./PathWrapper";

export const metadata: Metadata = {
  title: "AI-Bidder",
  description: "Generate winning proposals with AI",
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body>
        <Auth0ProviderWrapper>
          <PathnameWrapper>
            <main className="container mx-auto p-4">{children}</main>
          </PathnameWrapper>
        </Auth0ProviderWrapper>
      </body>
    </html>
  );
};

export default RootLayout;
