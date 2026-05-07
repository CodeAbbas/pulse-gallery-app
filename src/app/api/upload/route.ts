import { NextResponse } from "next/server";
import { uploadFileToBlob } from "@/lib/blob";
import { saveMediaMetadata } from "@/lib/cosmos";
import { validateEnvironment } from "@/lib/config";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: Request) {
  validateEnvironment();
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // --- NEW VALIDATION LOGIC ---
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "audio/mpeg",
      "audio/wav",
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Supported: JPG, PNG, WebP, MP3, WAV" },
        { status: 400 }
      );
    }

    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File exceeds 10MB limit" },
        { status: 400 }
      );
    }

    // 1. Upload the actual image/audio to Azure Blob Storage
    const uploadedFile = await uploadFileToBlob(file);

    // 2. Prepare the metadata object for Cosmos DB
    const mediaMetadata = {
      id: uuidv4(),
      userId: "user_01", // Partition key /userId
      fileName: uploadedFile.fileName,
      mediaType: uploadedFile.type,
      blobUrl: uploadedFile.url,
      uploadedAt: new Date().toISOString(),
      fileSize: uploadedFile.size,
      title: uploadedFile.fileName,
      description: "",
    };

    // 3. Save the record to Cosmos DB
    await saveMediaMetadata(mediaMetadata);

    return NextResponse.json({
      success: true,
      file: mediaMetadata,
    });
  } catch (error) {
    console.error("Upload/Metadata Error:", error);
    return NextResponse.json({ error: "Operation failed" }, { status: 500 });
  }
}