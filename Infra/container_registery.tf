resource "azurerm_container_registry" "main" {
  name                = "${var.project}acrJoaquim"
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  sku                 = var.acr_sku
  admin_enabled       = false
}
