import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentAdmin } from '@/lib/admin';

// GET - получение всех компаний
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ success: false, error: 'Не авторизован' }, { status: 401 });
    }

    const admin = await getCurrentAdmin(token);
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Доступ запрещён' }, { status: 403 });
    }

    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search') || '';

    const where: any = {};
    if (search) {
      where.name = { contains: search, mode: 'insensitive' };
    }

    const companies = await prisma.company.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        users: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            role: true,
            subscription: {
              select: {
                plan: true,
                isActive: true,
                endDate: true,
              },
            },
          },
        },
        tasks: {
          select: { id: true, title: true, status: true },
        },
        _count: {
          select: {
            users: true,
            tasks: true,
          },
        },
      },
    });

    // Добавляем информацию о тарифе для каждой компании
    const companiesWithPlan = companies.map(company => {
      // Находим директора компании
      const director = company.users.find(u => u.role === 'DIRECTOR');
      const subscription = director?.subscription;
      
      return {
        ...company,
        plan: subscription?.plan || 'FREE',
        planActive: subscription?.isActive ?? true,
        planEndDate: subscription?.endDate,
      };
    });

    return NextResponse.json({
      success: true,
      data: { companies: companiesWithPlan },
    });
  } catch (error) {
    console.error('Admin companies error:', error);
    return NextResponse.json({ success: false, error: 'Ошибка получения компаний' }, { status: 500 });
  }
}

// PUT - обновление компании
export async function PUT(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ success: false, error: 'Не авторизован' }, { status: 401 });
    }

    const admin = await getCurrentAdmin(token);
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Доступ запрещён' }, { status: 403 });
    }

    const body = await request.json();
    const { companyId, data } = body;

    if (!companyId) {
      return NextResponse.json({ success: false, error: 'ID компании обязателен' }, { status: 400 });
    }

    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;

    const company = await prisma.company.update({
      where: { id: companyId },
      data: updateData,
    });

    return NextResponse.json({ success: true, data: { company } });
  } catch (error) {
    console.error('Admin update company error:', error);
    return NextResponse.json({ success: false, error: 'Ошибка обновления компании' }, { status: 500 });
  }
}

// DELETE - удаление компании
export async function DELETE(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ success: false, error: 'Не авторизован' }, { status: 401 });
    }

    const admin = await getCurrentAdmin(token);
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Доступ запрещён' }, { status: 403 });
    }

    const searchParams = request.nextUrl.searchParams;
    const companyId = searchParams.get('companyId');

    if (!companyId) {
      return NextResponse.json({ success: false, error: 'ID компании обязателен' }, { status: 400 });
    }

    await prisma.company.delete({
      where: { id: companyId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin delete company error:', error);
    return NextResponse.json({ success: false, error: 'Ошибка удаления компании' }, { status: 500 });
  }
}
