import * as React from "react";

import { type Metadata } from "next";
import { SITE_INFO } from "@/constants/info";

export const metadata: Metadata = {
  title: "博客",
  description: `浏览 ${SITE_INFO.name} 的所有博客文章`,
};

export default function Layout({ children }: React.PropsWithChildren) {
  return <>{children}</>;
}
