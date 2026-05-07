import { NextRequest, NextResponse } from "next/server";
import { BlobServiceClient } from "@azure/storage-blob";
import { CosmosClient } from "@azure/cosmos";

const blobServiceClient = BlobServiceClient.fromConnectionString(
  process.env.AZURE_STORAGE_CONNECTION_STRING!
);

const cosmosClient = new CosmosClient({
  endpoint: process.env.COSMOS_ENDPOINT!,
  key: process.env.COSMOS_KEY!,
});

const database = cosmosClient.database(process.env.COSMOS_DATABASE!);
const container = database.container(process.env.COSMOS_CONTAINER!);

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const fileName = request.nextUrl.searchParams.get("fileName");

    if (!fileName) {
      return NextResponse.json(
        { error: "Missing fileName" },
        { status: 400 }
      );
    }

    // DELETE BLOB
    const blobContainer = blobServiceClient.getContainerClient(
      process.env.AZURE_STORAGE_CONTAINER_NAME!
    );

    const blobClient = blobContainer.getBlockBlobClient(fileName);

    await blobClient.deleteIfExists();

    // DELETE COSMOS METADATA
    await container.item(id, id).delete();

    return NextResponse.json({
      success: true,
      message: "Media deleted successfully",
    });
  } catch (error) {
    console.error("DELETE ERROR:", error);

    return NextResponse.json(
      { error: "Failed to delete media" },
      { status: 500 }
    );
  }
}