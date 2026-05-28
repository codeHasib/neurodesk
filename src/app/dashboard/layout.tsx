import AppLayout from "@/components/layout/AppLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "NeuroDesk | Dashboard",
  description: "AI-powered task management tool",
};

const DashboardLayout = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  return (
    <div>
      <AppLayout>{children}</AppLayout>
    </div>
  );
};

export default DashboardLayout;
