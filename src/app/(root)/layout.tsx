/**
 * 博客展示布局组件
 * 为所有博客展示页面添加 Navbar 和 Footer
 */

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
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
            <Footer />
            <BackToTop />
        </>
    );
}

