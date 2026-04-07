import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { hashPassword } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession(request);

    if (!session || session.role !== 'DIRECTOR') {
      return NextResponse.json(
        { success: false, error: 'Доступ запрещен' },
        { status: 403 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
    });

    if (!user || !user.companyId) {
      return NextResponse.json(
        { success: false, error: 'Компания не найдена' },
        { status: 404 }
      );
    }

    // Получаем всех сотрудников компании
    const employees = await prisma.user.findMany({
      where: {
        companyId: user.companyId,
        role: 'EMPLOYEE',
      },
      select: {
        id: true,
        username: true,
        firstName: true,
        lastName: true,
        position: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      data: employees,
    });
  } catch (error) {
    console.error('Get employees error:', error);
    return NextResponse.json(
      { success: false, error: 'Ошибка получения сотрудников' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('=== Добавление сотрудника ===');
    
    const session = await getSession(request);
    console.log('Session:', session);

    if (!session || session.role !== 'DIRECTOR') {
      return NextResponse.json(
        { success: false, error: 'Доступ запрещен' },
        { status: 403 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
    });
    console.log('User:', user);

    if (!user || !user.companyId) {
      return NextResponse.json(
        { success: false, error: 'Компания не найдена' },
        { status: 404 }
      );
    }

    const body = await request.json();
    console.log('Request body:', body);

    const { username, password, firstName, lastName, position } = body;

    if (!username || !password || !firstName || !lastName) {
      return NextResponse.json(
        { success: false, error: 'Все поля обязательны' },
        { status: 400 }
      );
    }

    // Проверка существующего пользователя
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });
    console.log('Existing user:', existingUser);

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'Пользователь с таким логином уже существует' },
        { status: 400 }
      );
    }

    // Хэширование пароля
    const hashedPassword = await hashPassword(password);
    console.log('Hashed password created');

    // Создание сотрудника
    console.log('Creating employee with data:', {
      username,
      firstName,
      lastName,
      position: position || 'MANAGER',
      role: 'EMPLOYEE',
      companyId: user.companyId,
      email: `${username}@local`,
    });

    const employee = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        firstName,
        lastName,
        position: position || 'MANAGER',
        role: 'EMPLOYEE',
        companyId: user.companyId,
        email: `${username}@local`,
      },
      select: {
        id: true,
        username: true,
        firstName: true,
        lastName: true,
        position: true,
        role: true,
        createdAt: true,
      },
    });
    console.log('Employee created:', employee);

    return NextResponse.json({
      success: true,
      data: employee,
    });
  } catch (error) {
    console.error('Create employee error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
    return NextResponse.json(
      { success: false, error: `Ошибка создания сотрудника: ${errorMessage}` },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getSession(request);

    if (!session || session.role !== 'DIRECTOR') {
      return NextResponse.json(
        { success: false, error: 'Доступ запрещен' },
        { status: 403 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
    });

    if (!user || !user.companyId) {
      return NextResponse.json(
        { success: false, error: 'Компания не найдена' },
        { status: 404 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID сотрудника не указан' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { firstName, lastName, position } = body;

    if (!firstName || !lastName || !position) {
      return NextResponse.json(
        { success: false, error: 'Все поля обязательны' },
        { status: 400 }
      );
    }

    // Проверяем, что сотрудник принадлежит компании директора
    const employee = await prisma.user.findUnique({
      where: { id },
    });

    if (!employee || employee.companyId !== user.companyId || employee.role !== 'EMPLOYEE') {
      return NextResponse.json(
        { success: false, error: 'Сотрудник не найден' },
        { status: 404 }
      );
    }

    // Обновление сотрудника
    const updatedEmployee = await prisma.user.update({
      where: { id },
      data: {
        firstName,
        lastName,
        position,
      },
      select: {
        id: true,
        username: true,
        firstName: true,
        lastName: true,
        position: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedEmployee,
    });
  } catch (error) {
    console.error('Update employee error:', error);
    return NextResponse.json(
      { success: false, error: 'Ошибка обновления сотрудника' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession(request);

    if (!session || session.role !== 'DIRECTOR') {
      return NextResponse.json(
        { success: false, error: 'Доступ запрещен' },
        { status: 403 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
    });

    if (!user || !user.companyId) {
      return NextResponse.json(
        { success: false, error: 'Компания не найдена' },
        { status: 404 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID сотрудника не указан' },
        { status: 400 }
      );
    }

    // Проверяем, что сотрудник принадлежит компании директора
    const employee = await prisma.user.findUnique({
      where: { id },
    });

    if (!employee || employee.companyId !== user.companyId || employee.role !== 'EMPLOYEE') {
      return NextResponse.json(
        { success: false, error: 'Сотрудник не найден' },
        { status: 404 }
      );
    }

    // Удаление сотрудника
    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Сотрудник удален',
    });
  } catch (error) {
    console.error('Delete employee error:', error);
    return NextResponse.json(
      { success: false, error: 'Ошибка удаления сотрудника' },
      { status: 500 }
    );
  }
}
