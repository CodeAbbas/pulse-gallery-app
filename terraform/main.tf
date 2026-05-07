terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 4.0"
    }
  }
}

provider "azurerm" {
  features {}
  subscription_id = var.subscription_id
}

# 1. Resource Group (Spain Central as per Portal)
resource "azurerm_resource_group" "rg" {
  name     = "pulse-gallery-rg"
  location = "Spain Central"
}

# 2. Storage Account (Explicitly France Central to match Portal)
resource "azurerm_storage_account" "storage" {
  name                     = "pulsegallerystorage"
  resource_group_name      = azurerm_resource_group.rg.name
  location                 = "France Central" # Override inheritance to match reality
  account_tier             = "Standard"
  account_replication_type = "LRS"
  access_tier              = "Hot"

  allow_nested_items_to_be_public = true
}

# 3. Blob Storage Container
resource "azurerm_storage_container" "container" {
  name                  = "media-files"
  storage_account_id    = azurerm_storage_account.storage.id
  container_access_type = "blob"
}

# 4. Cosmos DB Account (Explicitly France Central as per Portal)
resource "azurerm_cosmosdb_account" "cosmos" {
  name                = "pulsegallerydb"
  resource_group_name = azurerm_resource_group.rg.name
  location            = "France Central"
  
  offer_type          = "Standard"
  kind                = "GlobalDocumentDB"

  consistency_policy {
    consistency_level = "Session"
  }

  geo_location {
    location          = "France Central"
    failover_priority = 0
  }
  
  automatic_failover_enabled = true

  capabilities {
    name = "EnableServerless"
  }

  # Keeps Terraform from fighting with Azure's hidden portal tags
  lifecycle {
    ignore_changes = [tags]
  }
}

# 5. Cosmos SQL Database
resource "azurerm_cosmosdb_sql_database" "database" {
  name                = "pulsegallerydb"
  resource_group_name = azurerm_resource_group.rg.name
  account_name        = azurerm_cosmosdb_account.cosmos.name
}

# 6. Cosmos SQL Container (Synced with /id Partition Key)
resource "azurerm_cosmosdb_sql_container" "container" {
  name                = "MediaMetadata"
  resource_group_name = azurerm_resource_group.rg.name
  account_name        = azurerm_cosmosdb_account.cosmos.name
  database_name       = azurerm_cosmosdb_sql_database.database.name

  partition_key_paths    = ["/id"]
  partition_key_version  = 2
}