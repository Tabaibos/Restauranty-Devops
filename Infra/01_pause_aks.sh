#!/usr/bin/env bash
# Pausar o cluster inteiro (az aks stop) — pára de pagar pelas VMs dos

set -euo pipefail

log()  { echo -e "\033[1;34m[pause]\033[0m $*"; }
die()  { echo -e "\033[1;31m[pause]\033[0m $*" >&2; exit 1; }

command -v az >/dev/null 2>&1 || die "'az' não encontrado no PATH."
az account show >/dev/null 2>&1 || die "Faz 'az login' primeiro."

RESOURCE_GROUP="$(terraform output -raw resource_group_name)"
CLUSTER_NAME="$(terraform output -raw aks_cluster_name)"

NAP_MODE="$(az aks show --resource-group "$RESOURCE_GROUP" --name "$CLUSTER_NAME" \
  --query "nodeProvisioningProfile.mode" -o tsv 2>/dev/null || echo "")"
if [ "$NAP_MODE" = "Auto" ]; then
  die "O cluster has NAP ON (node_provisioning_profile.mode=Auto) -turn off NAP (terraform apply -var=\"enable_nap=false\") before stopping aks."
fi

log "Stopping cluster $CLUSTER_NAME (may take a while)..."
az aks stop --resource-group "$RESOURCE_GROUP" --name "$CLUSTER_NAME"
log "Cluster stopped."
log "To resume: ./02_resume_aks.sh"


az aks show --resource-group restauranty-rg-joaquim --name restauranty-aks --query "powerState.code" -o tsv  
