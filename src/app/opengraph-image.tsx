import { ImageResponse } from 'next/og';

// Image generation
export default async function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #1e40af, #312e81)',
          padding: '60px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100px',
            height: '100px',
            background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
            borderRadius: '20px',
            marginBottom: '40px',
            fontSize: '60px',
            color: 'white',
            fontWeight: 'bold',
          }}
        >
          D
        </div>
        <div
          style={{
            fontSize: '64px',
            fontWeight: 'bold',
            color: 'white',
            marginBottom: '24px',
            textAlign: 'center',
          }}
        >
          Delegon
        </div>
        <div
          style={{
            fontSize: '32px',
            color: '#93c5fd',
            textAlign: 'center',
            maxWidth: '800px',
          }}
        >
          Система делегирования задач для бизнеса
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
