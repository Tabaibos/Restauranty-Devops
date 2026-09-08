output "resource_group_name" {
  value = azurerm_resource_group.main.name
}

output "acr_login_server" {
  description = "Use this as the image prefix, e.g. <this>/restauranty-auth:v1"
  value       = azurerm_container_registry.main.login_server
}

output "acr_name" {
  value = azurerm_container_registry.main.name
}

output "aks_cluster_name" {
  value = azurerm_kubernetes_cluster.main.name
}

output "get_credentials_command" {
  description = "Run this to configure kubectl for this cluster"
  value       = "az aks get-credentials --resource-group ${azurerm_resource_group.main.name} --name ${azurerm_kubernetes_cluster.main.name}"
}

output "how_to_get_public_ip" {
  description = "The ingress IP takes a minute or two to be assigned after the k8s manifests are applied"
  value       = "kubectl get ingress restauranty-ingress -n restauranty"
}
