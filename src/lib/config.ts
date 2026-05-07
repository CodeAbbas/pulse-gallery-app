export const config = {
  azureStorageConnectionString:
    process.env.AZURE_STORAGE_CONNECTION_STRING || "",

  azureStorageContainerName:
    process.env.AZURE_STORAGE_CONTAINER_NAME || "",

  cosmosEndpoint:
    process.env.COSMOS_ENDPOINT || "",

  cosmosKey:
    process.env.COSMOS_KEY || "",

  cosmosDatabase:
    process.env.COSMOS_DATABASE || "",

  cosmosContainer:
    process.env.COSMOS_CONTAINER || "",
};

export function validateEnvironment() {
  const requiredEnvVars = [
    "AZURE_STORAGE_CONNECTION_STRING",
    "AZURE_STORAGE_CONTAINER_NAME",
    "COSMOS_ENDPOINT",
    "COSMOS_KEY",
    "COSMOS_DATABASE",
    "COSMOS_CONTAINER",
  ];

  requiredEnvVars.forEach((envVar) => {
    if (!process.env[envVar]) {
      throw new Error(
        `Missing required environment variable: ${envVar}`
      );
    }
  });
}