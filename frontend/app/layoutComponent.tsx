"use client";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/toast";
import { reduxStore } from "@/redux/store";
import { ReactNode } from "react";
import { Provider } from "react-redux";

export default function LayoutComponent({ children }: { children: ReactNode }) {
  return (
    <Provider store={reduxStore}>
      <SidebarProvider className="h-screen w-screen">
        <AppSidebar />
        <main className="flex h-full w-full flex-col relative">
          <section className="w-full fixed bg-white z-10">
            <SidebarTrigger className={"my-5 ml-1"} />
            <Separator />
          </section>
          <section className="px-2 mt-20 flex-1 relative">{children}</section>
          <Toaster />
        </main>
      </SidebarProvider>
    </Provider>
  );
}
