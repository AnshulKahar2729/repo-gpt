"use client";
import React from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
