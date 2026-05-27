import AppLayout from "@/components/layout/AppLayout";

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
