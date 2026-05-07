import { CosmosClient } from "@azure/cosmos";

import { config } from "./config";

function getContainer() {
  const client = new CosmosClient({
    endpoint: config.cosmosEndpoint,
    key: config.cosmosKey,
  });

  const database =
    client.database(
      config.cosmosDatabase
    );

  return database.container(
    config.cosmosContainer
  );
}

export async function saveMediaMetadata(
  media: any
) {
  const container = getContainer();

  const { resource } =
    await container.items.create(media);

  return resource;
}

export async function getAllMedia() {
  const container = getContainer();

  const { resources } =
    await container.items
      .query(
        "SELECT * FROM c ORDER BY c.uploadedAt DESC"
      )
      .fetchAll();

  return resources;
}