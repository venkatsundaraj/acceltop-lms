import React, { FC } from "react";
import Header from "@/app/_components/miscellaneous/header";
import Footer from "@/app/_components/miscellaneous/footer";

interface layoutProps {
  children: React.ReactNode;
}

const layout: FC<layoutProps> = ({ children }) => {
  return (
    <main className="w-screen overflow-x-hidden min-h-screen">
      <Header />
      {children}
      <Footer />
    </main>
  );
};

export default layout;
