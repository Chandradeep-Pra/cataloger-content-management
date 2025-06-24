import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import Error from 'next/error';


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


export async function POST(req: NextRequest) {
  const data = await req.formData();
  const file = data.get('file') as File;

  if (!file) {
    return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  try {
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream({ folder: 'my_uploads' }, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }).end(buffer);
    });

    return NextResponse.json({ success: true, data: result });
  } catch (err : any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}


export async function DELETE(req: NextRequest) {
  const body = await req.json();
  const { public_id } = body;

  if (!public_id) {
    return NextResponse.json({ success: false, error: 'Missing public_id' }, { status: 400 });
  }

  try {
    const result = await cloudinary.uploader.destroy(public_id);
    return NextResponse.json({ success: true, result });
  } catch (err : any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
