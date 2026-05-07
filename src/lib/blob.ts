import { BlobServiceClient } from "@azure/storage-blob";
import { v4 as uuidv4 } from "uuid";
import { config } from "./config";

const connectionString = config.azureStorageConnectionString;
const containerName = config.azureStorageContainerName;

export async function uploadFileToBlob(file: File) {
  // Defensive check for config
  if (!connectionString || !containerName) {
    throw new Error("Azure Storage configuration is missing.");
  }

  const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
  const containerClient = blobServiceClient.getContainerClient(containerName);

  const uniqueFileName = `${uuidv4()}-${file.name}`;
  const blockBlobClient = containerClient.getBlockBlobClient(uniqueFileName);

  const arrayBuffer = await file.arrayBuffer();

  // Uploading to the "media-files" container you set to 'Blob' access earlier
  await blockBlobClient.uploadData(arrayBuffer, {
    blobHTTPHeaders: { blobContentType: file.type },
  });

  return {
    fileName: uniqueFileName,
    url: blockBlobClient.url,
    type: file.type,
    size: file.size,
  };
}