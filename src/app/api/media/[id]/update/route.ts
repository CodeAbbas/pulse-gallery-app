import { NextRequest, NextResponse } from "next/server";
import { CosmosClient } from "@azure/cosmos";

const cosmosClient = new CosmosClient({
  endpoint: process.env.COSMOS_ENDPOINT!,
  key: process.env.COSMOS_KEY!,
});

const database = cosmosClient.database(
  process.env.COSMOS_DATABASE!
);

const container = database.container(
  process.env.COSMOS_CONTAINER!
);

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const body = await request.json();

    const { title, description } = body;

    const { resource } = await container
      .item(id, id)
      .read();

    if (!resource) {
      return NextResponse.json(
        { error: "Media not found" },
        { status: 404 }
      );
    }

    const updatedDocument = {
      ...resource,
      title,
      description,
    };

    const { resource: updated } =
      await container
        .item(id, id)
        .replace(updatedDocument);

    return NextResponse.json({
      success: true,
      media: updated,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Update failed" },
      { status: 500 }
    );
  }
}