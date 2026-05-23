"use client";

import * as React from "react";
import { ClerkProvider } from "@clerk/nextjs";
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from "next-themes";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
    </ClerkProvider>
  );
}
