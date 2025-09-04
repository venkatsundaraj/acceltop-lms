import React, { FC, PropsWithChildren } from "react";

interface layoutProps {
  children: React.ReactNode;
}

const layout: FC<layoutProps> = ({ children }) => {
  return (
    <main className="w-screen max-h-screen h-full flex items-center justify-center bg-background">
      {children}
    </main>
  );
};

export default layout;
