import { v2 as cloudinary } from 'cloudinary';
import { NextRequest } from 'next/server';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const POST = async (req : NextRequest) => {
  const body = await req.json();
  const { image, publicId, folder } = body;

  if (!image) {
    return new Response(JSON.stringify({ message: 'Image is required' }), { status: 400 });
  }

  try {
    const uploadResult = await cloudinary.uploader.upload(image, {
      public_id: publicId || undefined, 
      overwrite: true, 
      folder: folder,
    });

    return new Response(JSON.stringify({
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
    }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Upload failed', error }), { status: 500 });
  }
};
