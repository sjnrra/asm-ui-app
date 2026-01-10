// src/layout/MainLayout.tsx
import type { ReactNode } from "react";

interface MainLayoutProps {
  editor: ReactNode;
  panels: ReactNode;
}

export const MainLayout = ({ editor, panels }: MainLayoutProps) => {
  return (
    <div className="layout">
      <div className="left-pane">{editor}</div>
      <div className="right-pane">{panels}</div>
    </div>
  );
};