/**
 * 前台布局组件
 * 为所有前台页面添加 Navbar 和 Footer
 */

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
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
        </>
    );
}

