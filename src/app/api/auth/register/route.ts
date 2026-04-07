import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, createToken } from '@/lib/auth';

// Генерация логина из имени и фамилии (транслит)
const generateUsername = (firstName: string, lastName: string) => {
  const translit: Record<string, string> = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd',
    'е': 'e', 'ё': 'yo', 'ж': 'zh', 'з': 'z', 'и': 'i',
    'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n',
    'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't',
    'у': 'u', 'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch',
    'ш': 'sh', 'щ': 'sch', 'ъ': '', 'ы': 'y', 'ь': '',
    'э': 'e', 'ю': 'yu', 'я': 'ya'
  };

  const transliterate = (str: string) =>
    str.toLowerCase().split('').map(c => translit[c] || c).join('');

  const first = transliterate(firstName).replace(/[^a-z]/g, '');
  const last = transliterate(lastName).replace(/[^a-z]/g, '');

  return `${last}_${first}`;
};

export async function POST(request: NextRequest) {
  try {
    const { username, password, firstName, lastName, role, companyName, plan } = await request.json();

    // Валидация
    if (!username || !password || !firstName || !lastName || !companyName) {
      return NextResponse.json(
        { success: false, error: 'Все поля обязательны для заполнения' },
        { status: 400 }
      );
    }

    // Проверка существующего пользователя
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'Пользователь с таким логином уже существует' },
        { status: 400 }
      );
    }

    // Хэширование пароля
    const hashedPassword = await hashPassword(password);

    // Создание компании для директора
    let companyId: string | null = null;
    if (role === 'DIRECTOR') {
      const company = await prisma.company.create({
        data: {
          name: companyName,
          description: null,
        },
      });
      companyId = company.id;
    }

    // Создание пользователя с подпиской
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        firstName,
        lastName,
        email: null,
        role: role || 'DIRECTOR',
        position: 'MANAGER',
        companyId,
        subscription: {
          create: {
            plan: plan === 'TEAM' ? 'TEAM' : 'FREE',
            endDate: plan === 'TEAM' ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) : null,
          },
        },
      },
    });

    // Создание токена
    try {
      const token = await createToken({
        userId: user.id,
        username: user.username,
        role: user.role,
      });

      // Установка cookie
      const response = NextResponse.json({
        success: true,
        data: {
          user: {
            id: user.id,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
          },
        },
      });

      response.cookies.set('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24, // 24 часа
        path: '/',
      });

      return response;
    } catch (tokenError) {
      console.error('Token creation error:', tokenError);
      // Удаляем созданного пользователя если токен не создался
      await prisma.user.delete({ where: { id: user.id } });
      throw new Error('Ошибка создания сессии');
    }
  } catch (error) {
    console.error('Registration error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Ошибка регистрации';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
