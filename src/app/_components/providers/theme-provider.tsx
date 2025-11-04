"use client";
import { FC } from "react";
import { ThemeProvider } from "next-themes";

interface ClientThemeProviderProps {
  children: React.ReactNode;
}

const ClientThemeProvider: FC<ClientThemeProviderProps> = ({ children }) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="system">
      {children}
    </ThemeProvider>
  );
};

export default ClientThemeProvider;
