import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml', 'image/avif'];
const ALLOWED_PDF_TYPES = ['application/pdf'];
const ALLOWED_TYPES = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_PDF_TYPES];
const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20 MB

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'Dosya bulunamadı' }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `Desteklenmeyen dosya türü: ${file.type}. Kabul edilen: JPG, PNG, WebP, GIF, SVG, AVIF, PDF` },
        { status: 400 },
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'Dosya boyutu 20 MB\'dan büyük olamaz' }, { status: 400 });
    }

    const ext = file.name.split('.').pop()?.toLowerCase() || 'bin';
    const subfolder = ALLOWED_PDF_TYPES.includes(file.type) ? 'pdf' : 'images';
    const fileName = `${randomUUID()}.${ext}`;

    const uploadDir = path.join(process.cwd(), 'public', 'uploads', subfolder);
    await mkdir(uploadDir, { recursive: true });

    const bytes = await file.arrayBuffer();
    const filePath = path.join(uploadDir, fileName);
    await writeFile(filePath, Buffer.from(bytes));

    const url = `/uploads/${subfolder}/${fileName}`;

    return NextResponse.json({ url, fileName: file.name, size: file.size, type: file.type });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Dosya yüklenirken hata oluştu' }, { status: 500 });
  }
}
