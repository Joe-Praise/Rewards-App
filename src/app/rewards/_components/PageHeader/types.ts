import { ReactNode } from "react";

export interface PageHeaderProps {
  title: string;
  description?: string;
  badgeValue?: string | number;
  cta?: ReactNode;
}
