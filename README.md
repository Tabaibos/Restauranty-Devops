# Restauranty — DevOps Platform Engineering Project

A production-style DevOps platform built around a 3-microservice restaurant management app — the app itself is intentionally simple; the goal was to build and operate the full platform around it: **GitOps, observability, runtime security, admission control, cost visibility, and chaos-tested resilience** on Azure Kubernetes Service.

> 📄 See [`argocdDashboard.png`](./argocdDashboard.png) for argoCD UI displaying all the deployment managed.
> 📄 See [`ChaosTest_Report.pdf`](ChaosTest_Report.pdf) for full chaos engineering results.

---

## Challenges passed

Most portfolio projects show a finished architecture diagram. This portfolio shows the path to get there — a live AKS cluster that hit real, unscripted failures along the way, and the diagnosis and decisions that got it back to stable. Below are some highlights of troubleshooting when bilding this platform:
- Migrated 8+ imperative `helm upgrade` releases to a fully GitOps ArgoCD workflow
- Ran real chaos engineering experiments (Chaos Mesh) that uncovered a genuine resilience gap — a TCP-only readiness probe that never detected a broken MongoDB connection — rather than just confirming a happy path
- Had my own policy (Kyverno) catch real technical debt in my own platform — a missing `resources.limits` on the Grafana sidecars — proofing the guardrail works against its own author, not just hypothetical bad actors
- - Diagnosed a dual, independent root cause behind days of Grafana instability — an external plugin timing out on startup, stacked with a separate SQLite-vs-RollingUpdate concurrency bug — only found by reading `--previous` container logs line by line after multiple surface-level fixes failed

---

## Platform Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         GitHub Actions                          │
│  detect-changes → secret-scan (TruffleHog) → build+scan (Trivy) │
│         → sign (cosign, keyless/OIDC) → deploy (ArgoCD)         │
└──────────────────────────────┬──────────────────────────────────┘
                                │
┌───────────────────────────────▼──────────────────────────────────┐
│                         Azure Kubernetes Service                 │
│                                                                    │
│  GitOps (ArgoCD, 11+ Applications)                                │
│  ├─ Runtime security: Falco (eBPF)                                │
│  ├─ Admission control: Kyverno (image signing, resource limits,  │
│  │   non-root enforcement, PolicyReport auditing)                 │
│  ├─ Observability: Prometheus + Grafana + Loki + Tempo + Alloy    │
│  ├─ Cost visibility: Kubecost                                     │
│  ├─ Node scaling: NAP (Karpenter) + HPA + Descheduler             │
│  └─ Chaos engineering: Chaos Mesh                                 │
│                                                                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐            │
│  │ Auth Service │  │ Items Service│  │  Discounts   │            │
│  │  (Node/Exp)  │  │  (Node/Exp)  │  │  (Node/Exp)  │            │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘            │
│         └──────────────────┼──────────────────┘                   │
│                        MongoDB                                    │
└─────────────────────────────────────────────────────────────────┘
```

---

## Platform components

| Layer | Tool | What it does here |
|---|---|---|
| GitOps | ArgoCD | 11+ Applications, manual sync policy by design (documented trade-off) |
| IaC | Terraform | AKS, ACR, networking, NAP, RBAC |
| CI/CD | GitHub Actions | Change-detection per service, parallel security gates |
| Secret scanning | TruffleHog | Blocks builds on detected secrets |
| Image scanning | Trivy | CVE scanning, CRITICAL/HIGH fails the build |
| Image signing | cosign | Keyless (OIDC), verified at admission by Kyverno |
| Admission control | Kyverno | Image signature verification, resource limits, non-root enforcement |
| Runtime security | Falco | eBPF-based syscall monitoring, custom rules for the app namespace |
| Metrics | Prometheus | Cluster + application metrics |
| Logs | Loki | Centralized log aggregation |
| Traces | Tempo | Distributed tracing across all 3 microservices |
| Dashboards | Grafana | Cost, ops/support, and stakeholder-facing dashboards — all as code |
| Cost visibility | Kubecost | Per-namespace and per-service cost attribution |
| Node scaling | NAP (Karpenter-on-Azure) | Dynamic node provisioning under real scheduling pressure |
| Pod scaling | HPA | Validated live via chaos-induced CPU load |
| Chaos engineering | Chaos Mesh | Pod-kill, CPU stress, network partition experiments |

---

## The application (what's being operated)

3 Node.js/Express microservices + a React frontend, routed via HAProxy (local) or Kubernetes Ingress (production).

| Service | Path | Responsibility |
|---|---|---|
| Auth | `/api/auth/*` | Signup, login, JWT auth |
| Discounts | `/api/discounts/*` | Coupons, campaigns |
| Items | `/api/items/*` | Menu items, categories, orders |
| Frontend | `/` | React SPA admin dashboard |

### Running locally

```bash
docker run -d --name my-mongo -p 27017:27017 -v mongo-data:/data/db mongo:latest

cd backend/auth && npm install && npm start        # terminal 1
cd backend/discounts && npm install && npm start   # terminal 2
cd backend/items && npm install && npm start        # terminal 3
cd client && npm install && npm start               # terminal 4

haproxy -f haproxy.cfg
```

Access at `http://localhost/`.

Environment variables — see `.env.example` in each service folder. Never commit real secrets; in production these are injected via CI/CD directly into Kubernetes Secrets, never stored in Git.

---

## Known limitations (documented, not hidden)

- Kyverno `require-non-root` policy runs in `Audit` mode — 4 deployments still need `runAsNonRoot` + pinned tags before `Enforce` is safe
- Readiness probes use `tcpSocket`, not a real MongoDB connectivity check — discovered via chaos testing, fix requires an application-level `/health` endpoint
- Loki (`loki-distributed`) has a recurring, not-fully-root-caused index corruption bug under sustained load — migration to `SingleBinary` deployment mode is designed but not implemented (deferred: project scope)
- No multi-environment promotion (dev/staging/prod) — single-environment by design for this project's scope
- A synthetic-user probe was designed to actively measure real end-to-end availability (not just infer it from pod health), but was never implemented due to time constraints — the Stakeholders dashboard's "Availability" panel remains empty as a result

---
