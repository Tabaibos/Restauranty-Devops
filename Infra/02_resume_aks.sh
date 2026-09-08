#!/usr/bin/env bash
# Retoma um cluster parado com 01_pause_aks.sh. Tudo volta como estava
set -euo pipefail

log()  { echo -e "\033[1;34m[resume]\033[0m $*"; }
die()  { echo -e "\033[1;31m[resume]\033[0m $*" >&2; exit 1; }

command -v az >/dev/null 2>&1 || die "'az' não encontrado no PATH."
az account show >/dev/null 2>&1 || die "Faz 'az login' primeiro."

RESOURCE_GROUP="$(terraform output -raw resource_group_name)"
CLUSTER_NAME="$(terraform output -raw aks_cluster_name)"

log "Resuming cluster $CLUSTER_NAME (may take a while)..."
az aks start --resource-group "$RESOURCE_GROUP" --name "$CLUSTER_NAME"
log "Cluster active again."

log "Updating kubectl..."
az aks get-credentials --resource-group "$RESOURCE_GROUP" --name "$CLUSTER_NAME" --overwrite-existing

if kubectl get namespace restauranty >/dev/null 2>&1; then
  log "Pods in restauranty:"
  kubectl get pods -n restauranty
else
  log "Namespace 'restauranty' not exist yet — run Helm before."
fi

az aks show --resource-group restauranty-rg-joaquim --name restauranty-aks --query "powerState.code" -o tsv