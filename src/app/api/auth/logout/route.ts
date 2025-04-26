import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Create a response that will clear the token cookie
    const response = NextResponse.json({ success: true });
    
    // Clear the token cookie by setting maxAge to 0
    response.cookies.set('token', '', { 
      httpOnly: true, 
      path: '/', 
      maxAge: 0,
      expires: new Date(0)
    });
    
    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
