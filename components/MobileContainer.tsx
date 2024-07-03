// components/MobileContainer.tsx
import React from 'react';

interface MobileContainerProps {
  children: React.ReactNode;
}

const MobileContainer: React.FC<MobileContainerProps> = ({ children }) => {
  return (
    <div className="max-w-sm w-full mx-auto bg-gray-100 min-h-screen">
      {children}
    </div>
  );
};

export default MobileContainer;
