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
    /**
     * 图片上传处理函数
     * 上传图片到 Vercel Blob Storage
     */
    const handleUploadImages: BytemdEditorProps['uploadImages'] = async (files: File[]) => {
        const uploadPromises = files.map(async (file: File) => {
            try {
                // 创建 FormData
                const formData = new FormData();
                formData.append('file', file);

                // 调用上传 API
                const response = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData,
                });

                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.error || '上传失败');
                }

                const data = await response.json();

                return {
                    url: data.url,
                    title: file.name,
                };
            } catch (error) {
                console.error('图片上传失败:', error);
                // 如果上传失败，返回一个本地预览 URL
                return {
                    url: URL.createObjectURL(file),
                    title: file.name,
                };
            }
        });

        return Promise.all(uploadPromises);
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

