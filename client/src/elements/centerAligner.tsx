import React from "react";

type AlignerProps = {
  children: React.ReactNode;
};

const CenterAligner = ({ children }: AlignerProps) => {
  return (
    <div className="h-full sm:w-full flex flex-col justify-center items-center">
      {children}
    </div>
  );
};
export default CenterAligner;
