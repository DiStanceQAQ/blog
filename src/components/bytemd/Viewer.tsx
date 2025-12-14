"use client";

/**
 * ByteMD Viewer 组件
 * 用于在详情页渲染 Markdown 内容
 */

import { Viewer as BytemdViewer } from "@bytemd/react";
import gfm from "@bytemd/plugin-gfm";
import highlight from "@bytemd/plugin-highlight";
import "bytemd/dist/index.css";
import "highlight.js/styles/github.css";

interface ViewerProps {
    content: string;
    className?: string;
}

// ByteMD 插件配置
const plugins = [
    gfm(), // GitHub Flavored Markdown 支持
    highlight(), // 代码高亮
];

/**
 * ByteMD Markdown 内容渲染器
 * 支持 GitHub Flavored Markdown 和代码高亮
 */
export default function Viewer({ content, className = "" }: ViewerProps) {
    return (
        <div className={`bytemd-viewer ${className}`}>
            <BytemdViewer value={content} plugins={plugins} />
        </div>
    );
}

