/**
 * 博客展示布局组件
 * 为所有博客展示页面添加 Navbar
 */

import Navbar from "@/components/layout/Navbar";
import { BackToTop } from "@/components/back-to-top";
import { ReactNode } from "react";

interface RootLayoutProps {
    children: ReactNode;
}

export default function RootPublicLayout({ children }: RootLayoutProps) {
    return (
        <>
            <Navbar />
            <main className="flex-1">
                {children}
            </main>
            {/* <Footer /> */}
            <BackToTop />
        </>
    );
}

