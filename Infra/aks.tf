resource "azurerm_kubernetes_cluster" "main" {
  name                = "${var.project}-aks"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  dns_prefix          = "${var.project}-aks"

  default_node_pool {
    name           = "default"
    node_count     = var.aks_node_count
    vm_size        = var.aks_node_vm_size
    vnet_subnet_id = azurerm_subnet.aks.id
  }

  identity {
    type = "SystemAssigned"
  }

  network_profile {
    network_plugin       = "azure"
    load_balancer_sku    = "standard"
    network_plugin_mode  = var.enable_nap ? "overlay" : null
    pod_cidr             = var.enable_nap ? "10.244.0.0/16" : null
    network_data_plane   = var.enable_nap ? "cilium" : "azure"
    network_policy       = var.enable_nap ? "cilium" : null
    outbound_type        = "loadBalancer"
  }

  dynamic "node_provisioning_profile" {
    for_each = var.enable_nap ? [1] : []
    content {
      mode               = "Auto"
      default_node_pools = "Auto"
    }
  }
}

resource "azurerm_role_assignment" "aks_acr_pull" {
  scope                            = azurerm_container_registry.main.id
  role_definition_name             = "AcrPull"
  principal_id                     = azurerm_kubernetes_cluster.main.kubelet_identity[0].object_id
  skip_service_principal_aad_check = true
}

resource "azurerm_kubernetes_cluster_node_pool" "bigger" {
  name                  = "bigger"
  kubernetes_cluster_id = azurerm_kubernetes_cluster.main.id
  vm_size               = "Standard_D4s_v3"
  node_count            = 1
  vnet_subnet_id        = azurerm_subnet.aks.id
}