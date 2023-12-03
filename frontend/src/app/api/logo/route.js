// 'use server';

// pages/api/logo.js
import { NextResponse } from 'next/server';
import { CoreAPIBlob } from '@/dep/core/coreHandler';

export async function GET(req) {
  try {
    const backendLogoPath = 'logo';
    const { status, head, body: logoBlob } = await CoreAPIBlob('GET', backendLogoPath, null);

    if (status === 200) {
      // const logoBuffer = await logoBlob.arrayBuffer();

      const headers = new Headers();
      // console.log(logoBlob);
      const logoBuffer = Buffer.from(await logoBlob.arrayBuffer());

      headers.set('Content-Type', head.get('Content-Type') || 'image/jpeg');
      return new NextResponse(logoBuffer, {
        status: 200,
        statusText: 'OK',
        headers: {
          'Content-Type': head.get('Content-Type'),
        },
      });
    }
    // Handle other status codes with NextResponse
    return new NextResponse(null, {
      status,
    });
  } catch (error) {
    console.error(error);

    // Handle errors with NextResponse
    return new NextResponse(null, {
      status: 500,
      statusText: 'Internal Server Error',
    });
  }
}

export default GET;