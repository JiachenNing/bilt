"use client";

import { Inter } from "next/font/google";
import { Provider } from "react-redux";
import { makeStore } from "@/store";
import { setupListeners } from "@reduxjs/toolkit/query";
import StyledComponentsRegistry from "@/lib/registry";
import "./globals.css";
import { useRef } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Use useRef to prevent store recreation on re-render
  const storeRef = useRef<ReturnType<typeof makeStore> | undefined>(undefined);

  if (!storeRef.current) {
    storeRef.current = makeStore();
    setupListeners(storeRef.current.dispatch);
  }

  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider store={storeRef.current}>
          <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
        </Provider>
      </body>
    </html>
  );
}
