import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { auth } from '@clerk/nextjs/server';


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface CloudinaryUploadResult{
  public_id: string,
  [key:string]: any
}

export async function POST(req: NextRequest) {
  
  const {userId} = await auth()
  if(!userId){
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 400 });
  }
  

  try {
    const data = await req.formData();
  const file = data.get('file') as File;

  if (!file) {
    return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const result = await new Promise<CloudinaryUploadResult>((resolve, reject) => {
    cloudinary.uploader.upload_stream({ folder: 'Category' }, 
        (error, result) => {
      if (error) return reject(error);
      else resolve(result as CloudinaryUploadResult);
    }).end(buffer);
  });

  return NextResponse.json({ publicId: result.public_id  },{
    status:200
  });


  } catch (error) {
    
  }
  

  

  try {
    
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
