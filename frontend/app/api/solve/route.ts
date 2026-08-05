import { NextResponse } from 'next/server';

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const { start, target } = await request.json();

    if (!start || !target) {
      return NextResponse.json(
        { success: false, error: 'Both start and target words are required.' },
        { status: 400 }
      );
    }

    const cleanStart = String(start).trim().toLowerCase();
    const cleanTarget = String(target).trim().toLowerCase();

    if (cleanStart.length !== 4 || cleanTarget.length !== 4) {
      return NextResponse.json(
        { success: false, error: 'Words must be exactly 4 letters long.' },
        { status: 400 }
      );
    }

    // Configurable Backend URL for local and production deployment (e.g. Render)
    const backendUrl =
      process.env.BACKEND_URL ||
      process.env.NEXT_PUBLIC_BACKEND_URL ||
      'http://127.0.0.1:8000';

    const response = await fetch(`${backendUrl}/solve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        start: cleanStart,
        target: cleanTarget,
      }),
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        {
          success: false,
          error: errorData.detail || errorData.error || 'FastAPI server error.',
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (err: any) {
    console.error('API proxy error:', err);
    return NextResponse.json(
      {
        success: false,
        error:
          'Could not reach FastAPI backend server. Ensure backend is running.',
      },
      { status: 503 }
    );
  }
}
