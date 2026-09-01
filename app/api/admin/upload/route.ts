import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
  console.log("[Upload API] Request received");
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const folder = (formData.get("folder") as string) || "uploads";

    if (!file) {
      console.log("[Upload API] No file provided");
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    console.log("[Upload API] File:", file.name, "type:", file.type, "size:", file.size, "folder:", folder);

    if (!file.type.startsWith("image/")) {
      console.log("[Upload API] Invalid file type:", file.type);
      return NextResponse.json({ error: "File harus berupa gambar" }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      console.log("[Upload API] File too large:", file.size);
      return NextResponse.json({ error: "Ukuran gambar maksimal 5MB" }, { status: 400 });
    }

    const configOk = !!(process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);
    console.log("[Upload API] Cloudinary config OK:", configOk);

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    console.log("[Upload API] Buffer created, size:", buffer.length);

    const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: `avenxo/${folder}`,
            resource_type: "image",
            public_id: `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`,
          },
          (error, result) => {
            if (error) {
              console.error("[Upload API] Cloudinary error:", error);
              reject(error);
            } else {
              console.log("[Upload API] Cloudinary success:", result?.secure_url);
              resolve(result as { secure_url: string });
            }
          }
        )
        .end(buffer);
    });

    return NextResponse.json({ url: result.secure_url });
  } catch (err: any) {
    console.error("[Upload API] Catch error:", err);
    return NextResponse.json({ error: err.message || "Upload failed" }, { status: 500 });
  }
}
