import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production'
);

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export interface JWTPayload {
  userId: string;
  username: string;
  role: string;
  [key: string]: string;
}

export async function createToken(payload: JWTPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<JWTPayload> {
  const { payload } = await jwtVerify(token, JWT_SECRET);
  return payload as JWTPayload;
}

export async function getSession(request: Request): Promise<JWTPayload | null> {
  const cookie = request.headers.get('cookie');
  if (!cookie) return null;

  const tokenMatch = cookie.match(/token=([^;]+)/);
  if (!tokenMatch) return null;

  try {
    return await verifyToken(tokenMatch[1]);
  } catch {
    return null;
  }
}
