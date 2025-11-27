"use client";

/**
 * T13 - ByteMD 编辑器组件封装
 * 用于博客内容的 Markdown 编辑
 */

import { Editor as BytemdEditor, EditorProps as BytemdEditorProps } from "@bytemd/react";
import gfm from "@bytemd/plugin-gfm";
import highlight from "@bytemd/plugin-highlight";
import "bytemd/dist/index.css";
import "highlight.js/styles/github.css";

interface EditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    height?: string;
}

// ByteMD 插件配置
const plugins = [
    gfm(), // GitHub Flavored Markdown 支持
    highlight(), // 代码高亮
];

/**
 * ByteMD 编辑器组件
 * 提供所见即所得的 Markdown 编辑体验
 */
export default function Editor({ value, onChange, placeholder, height = "500px" }: EditorProps) {
    const handleUploadImages: BytemdEditorProps['uploadImages'] = async (files: File[]) => {
        // 可以实现图片上传功能，这里先返回占位符
        return files.map((file: File) => ({
            url: URL.createObjectURL(file),
            title: file.name,
        }));
    };

    return (
        <div
            className="bytemd-wrapper"
            style={{
                height,
                border: "1px solid #e5e7eb",
                borderRadius: "0.5rem",
                overflow: "hidden",
            }}
        >
            <BytemdEditor
                value={value}
                placeholder={placeholder}
                plugins={plugins}
                onChange={onChange}
                uploadImages={handleUploadImages}
            />
        </div>
    );
}

