import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  // Публичные маршруты (доступны без авторизации)
  const publicRoutes = ['/', '/login', '/register'];
  const isPublicRoute = publicRoutes.includes(pathname);

  // Публичные маршруты, доступные даже авторизованным пользователям
  const publicAllRoutes = [
    '/pricing',
    '/privacy',
    '/terms',
    '/delegirovanie-zadach',
    '/upravlenie-zadachami',
    '/kontrol-sotrudnikov',
    '/about',
    '/contacts'
  ];
  const isPublicAllRoute = publicAllRoutes.includes(pathname);

  // Если нет токена и пытаемся войти на защищенный маршрут
  if (!token && !isPublicRoute && !isPublicAllRoute) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Если есть токен и пытаемся войти на публичный маршрут (кроме pricing)
  if (token && isPublicRoute && pathname !== '/') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Защита админ-панели
  if (pathname.startsWith('/admin')) {
    // Для API админ-панели проверяем токен
    if (pathname.startsWith('/api/admin')) {
      if (!token) {
        return NextResponse.json(
          { success: false, error: 'Требуется авторизация' },
          { status: 401 }
        );
      }
      // Проверка роли админа будет в API handler
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|icon|apple-icon|opengraph-image).*)'],
};
