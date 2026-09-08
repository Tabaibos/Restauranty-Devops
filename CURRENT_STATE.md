INFRA is created 


When NAP is active, i cant stop the cluster 
"az aks stop --name restauranty-aks --resource-group restauranty-rg-joaquim
(OperationNotAllowed) Unable to perform 'stopping' operation since the cluster enables .properties.nodeProvisioningProfile.mode 'Auto'
Code: OperationNotAllowed
Message: Unable to perform 'stopping' operation since the cluster enables .properties.nodeProvisioningProfile.mode 'Auto'"


NEXT STEP: Testing NAP
SOLUTION: Create feature switch to set before hand if we go by NAP or not 


BEWARE; ORDER BY WHICH APP IS DEPLOYED; MONGO CONNECTION POOL COULD HAVE ERROR


https://medium.com/@vincenthartmann/how-to-add-a-security-scan-with-trivy-in-github-actions-8f16642aa82b to add trivy, but need to login into acr first 

grafana and prometheus is up, still need to scrape data 
https://oneuptime.com/blog/post/2026-02-16-how-to-set-up-prometheus-and-grafana-monitoring-stack-on-aks-using-helm/view   step 8 por fazer 