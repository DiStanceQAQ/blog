import { put } from '@vercel/blob';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

/**
 * 图片上传 API
 * 使用 Vercel Blob Storage 存储图片
 */
export async function POST(request: NextRequest) {
  try {
    // 检查是否有文件上传
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: '请选择要上传的文件' },
        { status: 400 }
      );
    }

    // 验证文件类型
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: '不支持的文件类型，仅支持 JPEG、PNG、GIF、WebP 和 SVG 图片' },
        { status: 400 }
      );
    }

    // 验证文件大小（最大 4MB）
    const maxSize = 4 * 1024 * 1024; // 4MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: '文件大小超过限制（最大 4MB）' },
        { status: 400 }
      );
    }

    // 生成唯一文件名
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const extension = file.name.split('.').pop();
    const filename = `blog-images/${timestamp}-${randomString}.${extension}`;

    // 上传到 Vercel Blob Storage
    const blob = await put(filename, file, {
      access: 'public',
      addRandomSuffix: false,
    });

    // 返回图片 URL
    return NextResponse.json({
      url: blob.url,
      filename: blob.pathname,
    });
  } catch (error) {
    console.error('图片上传失败:', error);
    return NextResponse.json(
      { error: '图片上传失败，请稍后重试' },
      { status: 500 }
    );
  }
}
