import { NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { r2Client, R2_BUCKET_NAME, R2_PUBLIC_URL } from "@/lib/r2";

export async function POST(req) {
  try {
    const { filename, contentType, folder = "uploads" } = await req.json();

    if (!filename || !contentType) {
      return NextResponse.json({ error: "Filename and contentType are required" }, { status: 400 });
    }

    // Generate unique key to prevent file overwrites
    const fileExtension = filename.split(".").pop();
    const uniqueId = crypto.randomUUID().replace(/-/g, "").substring(0, 16);
    const key = `${folder}/${uniqueId}.${fileExtension}`;

    // Prepare S3 PutObject Command
    const command = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
      ContentType: contentType,
    });

    // Generate presigned upload URL (valid for 15 minutes)
    const uploadUrl = await getSignedUrl(r2Client, command, { expiresIn: 900 });

    // Note: since R2_PUBLIC_URL is not set yet, we will just return the key for now.
    // The client can use the R2 endpoint URL directly for downloading if public, or fetch via another API.
    const publicUrl = R2_PUBLIC_URL ? `${R2_PUBLIC_URL}/${key}` : `https://pub-xxxxxx.r2.dev/${key}`;

    return NextResponse.json({
      uploadUrl,
      publicUrl,
      key,
    });
  } catch (error) {
    console.error("Presigned URL Error:", error);
    return NextResponse.json({ error: "Failed to generate presigned upload URL" }, { status: 500 });
  }
}
