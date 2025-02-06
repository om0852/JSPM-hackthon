import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request) {
  try {
    // Get current user
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the form data
    const formData = await request.formData();
    const file = formData.get('file');
    const type = formData.get('type');

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Set upload options based on file type
    const uploadOptions = {
      folder: `jspm/${user.id}`,
      resource_type: type === 'video' ? 'video' : 'image',
    };

    // If it's a video, generate a thumbnail
    if (type === 'video') {
      uploadOptions.eager = [
        { width: 300, height: 200, crop: 'fill', format: 'jpg' }
      ];
    }

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        uploadOptions,
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      uploadStream.end(buffer);
    });

    // Return the URLs
    return NextResponse.json({
      success: true,
      data: {
        url: result.secure_url,
        thumbnailUrl: type === 'video' ? result.eager[0].secure_url : result.secure_url,
      }
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
} 