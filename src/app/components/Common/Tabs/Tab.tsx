import React, { ReactNode } from 'react';

export interface TabProps {
  children: ReactNode;
  name: string;
  route: string;
}

const Tab: React.FC<TabProps> = ({ children }: TabProps) => {
  return <>{children}</>;
};

export default Tab;
