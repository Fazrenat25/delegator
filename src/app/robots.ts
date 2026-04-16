import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/dashboard/',
          '/admin/',
          '/api/',
          '/login',
          '/register',
          '/checkout',
        ],
      },
      {
        userAgent: 'Yandex',
        allow: '/',
        disallow: [
          '/dashboard/',
          '/admin/',
          '/api/',
          '/login',
          '/register',
          '/checkout',
        ],
      },
    ],
    sitemap: 'https://delegon.ru/sitemap.xml',
    host: 'https://delegon.ru',
  };
}
