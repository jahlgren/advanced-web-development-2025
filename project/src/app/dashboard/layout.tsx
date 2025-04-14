"use client";

import { Header } from "@/components/blocks/header";
import { Container } from "@/components/ui/container";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="m-6">
      <Container>
        <Header />
        <main>
          {children}
        </main>
      </Container>
    </div>
  );
}
