import { NextResponse } from 'next/server';

export const GET = async () => {
  try {
    // Basic health check - verify the server is running
    // In production, you could also check database connectivity here
    const response = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'cgos-platform',
      version: '1.0.0',
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Health check error:', error);
    return NextResponse.json(
      { status: 'error', message: 'Health check failed' },
      { status: 500 }
    );
  }
};