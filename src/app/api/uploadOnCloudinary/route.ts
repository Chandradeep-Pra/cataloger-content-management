import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Interface for the response data
interface CloudinaryUploadResponse {
  success: boolean;
  url?: string;
  public_id?: string;
  secure_url?: string;
  error?: string;
}

// Interface for upload options
interface UploadOptions {
  folder?: string;
  transformation?: object;
  public_id?: string;
  overwrite?: boolean;
  resource_type?: 'image' | 'video' | 'raw' | 'auto';
}


async function uploadToCloudinary(
  file: Buffer | string,
  options: UploadOptions = {}
): Promise<any> {
  return new Promise((resolve, reject) => {
    const uploadOptions = {
      resource_type: 'auto' as const,
      folder: options.folder || 'uploads', // Default folder
      transformation: options.transformation,
      public_id: options.public_id,
      overwrite: options.overwrite ?? true,
      ...options,
    };

    cloudinary.uploader.upload(
      file,
      uploadOptions,
      (error: any, result: any) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
  });
}

/**
 * POST handler for uploading images to Cloudinary
 * Accepts both FormData (with file) and JSON (with base64 image)
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Check if Cloudinary is properly configured
    if (!process.env.CLOUDINARY_CLOUD_NAME || 
        !process.env.CLOUDINARY_API_KEY || 
        !process.env.CLOUDINARY_API_SECRET) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Cloudinary configuration missing. Please check environment variables.' 
        },
        { status: 500 }
      );
    }

    const contentType = request.headers.get('content-type') || '';
    let fileBuffer: Buffer;
    let uploadOptions: UploadOptions = {};

    // Handle FormData (file upload)
    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const file = formData.get('file') as File;
      
      if (!file) {
        return NextResponse.json(
          { success: false, error: 'No file provided' },
          { status: 400 }
        );
      }

      // Validate file type (only images)
      if (!file.type.startsWith('image/')) {
        return NextResponse.json(
          { success: false, error: 'Only image files are allowed' },
          { status: 400 }
        );
      }

      // Validate file size (max 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB in bytes
      if (file.size > maxSize) {
        return NextResponse.json(
          { success: false, error: 'File size too large. Maximum 10MB allowed.' },
          { status: 400 }
        );
      }

      // Convert file to buffer
      const arrayBuffer = await file.arrayBuffer();
      fileBuffer = Buffer.from(arrayBuffer);

      // Get additional options from FormData
      const folder = formData.get('folder') as string;
      const publicId = formData.get('public_id') as string;
      
      if (folder) uploadOptions.folder = folder;
      if (publicId) uploadOptions.public_id = publicId;
    }
    // Handle JSON data (base64 image)
    else if (contentType.includes('application/json')) {
      const body = await request.json();
      
      if (!body.image) {
        return NextResponse.json(
          { success: false, error: 'No image data provided' },
          { status: 400 }
        );
      }

      // Handle base64 image data
      let base64Data = body.image;
      
      // Remove data URL prefix if present (data:image/jpeg;base64,...)
      if (base64Data.startsWith('data:')) {
        base64Data = base64Data.split(',')[1];
      }

      fileBuffer = Buffer.from(base64Data, 'base64');
      
      // Set upload options from request body
      uploadOptions = {
        folder: body.folder || 'uploads',
        public_id: body.public_id,
        transformation: body.transformation,
        overwrite: body.overwrite ?? true,
      };
    } else {
      return NextResponse.json(
        { success: false, error: 'Unsupported content type' },
        { status: 400 }
      );
    }

    // Upload to Cloudinary
    const uploadResult = await uploadToCloudinary(fileBuffer, uploadOptions);

    // Return success response with upload details
    const response: CloudinaryUploadResponse = {
      success: true,
      url: uploadResult.url,
      secure_url: uploadResult.secure_url,
      public_id: uploadResult.public_id,
    };

    return NextResponse.json(response, { status: 200 });

  } catch (error: any) {
    console.error('Cloudinary upload error:', error);
    
    // Return error response
    const errorResponse: CloudinaryUploadResponse = {
      success: false,
      error: error.message || 'Upload failed',
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}

/**
 * DELETE handler for deleting images from Cloudinary
 * Expects JSON body with public_id
 */
export async function DELETE(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    
    if (!body.public_id) {
      return NextResponse.json(
        { success: false, error: 'public_id is required' },
        { status: 400 }
      );
    }

    // Delete from Cloudinary
    const deleteResult = await cloudinary.uploader.destroy(body.public_id);

    if (deleteResult.result === 'ok') {
      return NextResponse.json(
        { success: true, message: 'Image deleted successfully' },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { success: false, error: 'Failed to delete image' },
        { status: 400 }
      );
    }

  } catch (error: any) {
    console.error('Cloudinary delete error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Delete failed' 
      },
      { status: 500 }
    );
  }
}