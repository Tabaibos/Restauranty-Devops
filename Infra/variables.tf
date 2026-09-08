variable "location" {
  description = "Azure region"
  type        = string
  default     = "westeurope"
}

variable "resource_group_name" {
  description = "Name of the resource group"
  type        = string
  default     = "restauranty-rg-joaquim"
}

variable "project" {
  description = "Prefix used to name resources"
  type        = string
  default     = "restauranty"
}

variable "aks_node_count" {
  description = "Number of nodes in the AKS default node pool"
  type        = number
  default     = 1
}

variable "aks_node_vm_size" {
  description = "VM size for AKS nodes"
  type        = string
  default     = "Standard_B2s"
}

variable "acr_sku" {
  description = "SKU for the Azure Container Registry"
  type        = string
  default     = "Basic"
}


variable "enable_nap" {
  description = "Whether to enable Node Auto-Provisioning (NAP / managed Karpenter). Default false so az aks stop/start (03-pause.sh / 04-resume.sh) keeps working — AKS does not allow stopping a cluster with NAP enabled."
  type        = bool
  default     = false
}