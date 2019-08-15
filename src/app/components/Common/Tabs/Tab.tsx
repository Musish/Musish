import React, { ReactNode } from 'react';

export interface ITabProps {
  children: ReactNode;
  name: string;
  route: string;
}

const Tab: React.FC<ITabProps> = ({ children }: ITabProps) => {
  return <>{children}</>;
};

export default Tab;
