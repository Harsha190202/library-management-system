import type { Metadata } from "next";
import AdminHeader from "../../components/AdminHeader";
export const metadata: Metadata = {
  title: "Admin Routes",
  description: "Routes for admin to edit delete create data",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <body>
      <AdminHeader />
      {children}
    </body>
  );
}
