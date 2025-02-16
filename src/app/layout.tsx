import { metadata } from "@/meta/metadata";

metadata.manifest = "/manifest.json";

export { metadata };

import { poppins, robotoMono } from "@/font/fonts";

import Providers from "@/router/Provider";

import Pathname from "@/router/Pathname";

import "@/style/globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} ${robotoMono.variable} antialiased`}
      >
        <Providers>
          <Pathname>
            {children}
          </Pathname>
        </Providers>
      </body>
    </html>
  );
}
