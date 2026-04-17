import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentAdmin } from '@/lib/admin';

// GET - получить все посты блога
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const published = searchParams.get('published');

    const posts = await prisma.blogPost.findMany({
      where: published ? { published: published === 'true' } : undefined,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      data: { posts },
    });
  } catch (error) {
    console.error('Blog GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Ошибка получения постов' },
      { status: 500 }
    );
  }
}

// POST - создать новый пост (только для админа)
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Не авторизован' },
        { status: 401 }
      );
    }

    const admin = await getCurrentAdmin(token);
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Доступ запрещен' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { title, content } = body;

    if (!title || !content) {
      return NextResponse.json(
        { success: false, error: 'Название и текст обязательны' },
        { status: 400 }
      );
    }

    const post = await prisma.blogPost.create({
      data: {
        title: title.trim(),
        content: content.trim(),
      },
    });

    return NextResponse.json({
      success: true,
      data: { post },
    });
  } catch (error) {
    console.error('Blog POST error:', error);
    return NextResponse.json(
      { success: false, error: 'Ошибка создания поста' },
      { status: 500 }
    );
  }
}

// DELETE - удалить пост (только для админа)
export async function DELETE(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Не авторизован' },
        { status: 401 }
      );
    }

    const admin = await getCurrentAdmin(token);
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Доступ запрещен' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('postId');

    if (!postId) {
      return NextResponse.json(
        { success: false, error: 'ID поста не указан' },
        { status: 400 }
      );
    }

    await prisma.blogPost.delete({
      where: { id: postId },
    });

    return NextResponse.json({
      success: true,
      message: 'Пост удален',
    });
  } catch (error) {
    console.error('Blog DELETE error:', error);
    return NextResponse.json(
      { success: false, error: 'Ошибка удаления поста' },
      { status: 500 }
    );
  }
}
