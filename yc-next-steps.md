# bioAF — Next Steps, Timeline & Cost Estimates

## Current State (v0.3.15)

- 7 shipped phases, 39 ADRs, production-grade platform
- 3 nf-core pipelines configured (scrnaseq, rnaseq, fetchngs)
- Full Kubernetes + GCS adapter stack implemented (~2,700 lines)
- SLURM + NFS adapters architecturally defined, 0% implemented
- Snakemake component registered, marked "coming soon", no execution logic
- Provenance reports implemented (JSON/MD/PDF/CSV) with pipeline input lineage + notebook output tracking
- Idle session detection implemented with configurable timeouts
- GCS persistence via gsutil rsync (notebooks) and CSI FUSE (read-only data mounts)

---

## Development Roadmap

### Phase A: Pipeline Expansion (Weeks 1–3)

#### A1. Additional nf-core Pipelines
**Current:** 3 pipelines (scrnaseq, rnaseq, fetchngs)
**Target:** 8–10 pipelines covering major workflow types

| Pipeline | Use Case | Est. Effort |
|----------|----------|-------------|
| nf-core/sarek | Variant calling (WES/WGS) | 2–3 days |
| nf-core/atacseq | Chromatin accessibility | 2–3 days |
| nf-core/chipseq | Protein-DNA binding | 2–3 days |
| nf-core/methylseq | Bisulfite methylation | 2–3 days |
| nf-core/ampliseq | 16S amplicon sequencing | 2–3 days |
| nf-core/nanoseq | Long-read sequencing | 2–3 days |
| nf-core/differentialabundance | Post-quantification DE | 1–2 days |

**Per-pipeline work:** Fetch schema from GitHub, define default parameters JSON, configure QC dashboard mappings, test end-to-end on GKE.

**Total: ~2–3 weeks | Infra cost: ~$50–100 (GKE spot instances for test runs)**

#### A2. Snakemake Support
**Current:** Component catalog entry only. No config generator, command builder, trace parser, or progress monitoring. Pipeline submission is hardcoded for Nextflow.
**Work required:**
- Snakemake config generator (K8s executor profile)
- Command builder in KubernetesComputeProvider (branch on engine type)
- Snakemake log/report parser for progress monitoring
- Frontend: engine selector in pipeline submission UI
- ~300–500 lines backend, ~100 lines frontend

**Total: ~2–3 weeks | Infra cost: ~$50 (test cluster time)**

---

### Phase B: GCS & Session Improvements (Weeks 2–4)

#### B1. GCS File Mounting Hardening
**Current:** CSI FUSE driver for read-only data mounts on work nodes; gsutil rsync for notebook persistence. ADR-022 documents gcsfuse performance limitations for random I/O.
**Work required:**
- Evaluate and configure FUSE caching parameters for interactive workloads
- Add write-back support for notebook data directories (currently read-only)
- Handle mount failure recovery (currently fails silently)
- Add health check for FUSE mounts in session monitor polling

**Total: ~1–2 weeks | Infra cost: ~$30 (test sessions)**

#### B2. Idle Recognition Enhancement
**Current:** Implemented — polls every 60s, 4hr default timeout, 15min warning, graceful GCS sync on termination. `last_activity_at` requires explicit updates.
**Work required:**
- Add kernel-level activity detection (Jupyter API polling for last kernel activity)
- Add RStudio session activity detection
- Integrate with GKE node pool scale-down for true zero-cost idle
- Expose idle settings per-organization in UI

**Total: ~1 week | Infra cost: ~$20 (test sessions)**

---

### Phase C: SLURM + NFS (Weeks 5–10)

#### C1. SLURM Compute Adapter
**Current:** Interface defined (11 methods), all raise NotImplementedError. Registry dispatch logic ready.
**Work required:**
- SLURM REST API or pyslurm integration (~800–1,200 lines)
- SBATCH script generation from job specs
- State mapping (SLURM states → bioAF normalized states)
- Job log retrieval and persistence
- Cost estimation (no native SLURM billing — needs instance pricing model)
- Terraform modules for SLURM controller + compute nodes on GCP

**Total: ~3–4 weeks | Infra cost: ~$200–400 (SLURM test cluster on GCP VMs)**

#### C2. NFS Storage Adapter
**Current:** Interface defined (5 methods), all raise NotImplementedError.
**Work required:**
- Path resolution and symlink/copy strategies (~250–400 lines)
- Google Filestore provisioning via Terraform
- Quota management (NFS has no native lifecycle policies like GCS)
- Checksum computation for large files on network storage

**Total: ~1–2 weeks | Infra cost: ~$100 (Filestore minimum provisioning)**

#### C3. SLURM Notebook Adapter
**Current:** Interface defined (5 methods), all raise NotImplementedError.
**Work required:**
- Interactive job allocation via salloc (~500–700 lines)
- Port forwarding / tunnel setup for Jupyter/RStudio
- Home directory persistence on NFS
- Activity tracking without Kubernetes API (SSH-based heartbeat)

**Total: ~2–3 weeks | Infra cost: included in C1 cluster**

---

### Phase D: Metadata & Provenance (Weeks 4–8)

#### D1. Metadata Cleaning & Sanitization
**Current:** No validation, normalization, or controlled vocabularies. Data passes through as-is.
**Work required:**
- Controlled vocabulary service (organism, tissue type, library prep)
- Synonym resolution ("human" → "Homo sapiens", case/whitespace normalization)
- Schema enforcement per experiment type (required fields, type coercion)
- Validation report on ingest (warnings vs. blocking errors)
- Bulk update/correction API

**Total: ~2–3 weeks | Infra cost: negligible**

#### D2. Google Sheets Integration for Metadata Ingest
**Current:** No integration. Metadata entry is manual or CSV upload only.
**Work required:**
- Google Sheets API OAuth flow (service account or user-delegated)
- Sheet discovery and column mapping UI
- Import service with preview/validation before commit
- Scheduled re-sync option (pull updated metadata on interval)

**Total: ~1–2 weeks | Infra cost: negligible (Sheets API is free)**

#### D3. Enhanced Metadata Ingest
**Current:** Auto-ingest via GCS Pub/Sub with filename parsing. No file-level metadata extraction.
**Work required:**
- FASTQ statistics extraction (read count, quality scores via seqkit/fastp)
- BAM header parsing (reference genome, read groups)
- h5ad inspection (cell/gene counts, obs/var fields)
- VCF summary (variant count, reference, sample list)

**Total: ~2–3 weeks | Infra cost: ~$30 (compute for parsing test datasets)**

#### D4. Provenance Reporting — SevenBridges Parity
**Current:** Reports exist in all 4 formats. Pipeline input lineage and notebook output tracking complete. Missing: nested provenance chains, dataset-level schemas, cross-experiment lineage views.
**Work required:**
- Multi-hop lineage DAG (sample → pipeline A → intermediate → pipeline B → final result)
- Cross-experiment provenance queries
- Comparison view (diff two provenance chains)
- Export to CWLProv or RO-Crate format for interoperability
- Visual provenance explorer in frontend (interactive DAG)

**Total: ~3–4 weeks | Infra cost: negligible**

---

### Phase E: Multi-Tenant Hosted Version (Weeks 12–20)

#### E1. Multi-Tenancy Architecture
**Current:** Single-tenant (one org per deployment). Control plane is lightweight (~$14/mo).
**Work required:**
- Shared control plane with tenant isolation (separate GCP projects per tenant)
- Tenant provisioning API (create org → spin up isolated compute)
- Centralized auth with tenant routing (subdomain or path-based)
- Tenant-level resource quotas and billing isolation
- Admin dashboard for tenant management

**Total: ~4–6 weeks | Infra cost: ~$200–500/mo (staging multi-tenant environment)**

#### E2. Billing & Subscription
**Work required:**
- Stripe integration for subscription management
- Usage metering (compute hours, storage GB, pipeline runs)
- Tier definition (free / pro / enterprise)
- Invoice generation and payment processing
- Usage dashboards per tenant

**Total: ~2–3 weeks | Infra cost: negligible (Stripe test mode)**

#### E3. Operational Readiness
**Work required:**
- SLA monitoring and alerting
- Tenant data backup and disaster recovery
- Security audit for multi-tenant isolation
- Documentation and onboarding flow for self-service signup

**Total: ~2–3 weeks | Infra cost: ~$100 (monitoring tooling)**

---

## Summary Timeline

| Phase | Work | Duration | Infra Cost |
|-------|------|----------|------------|
| A | Pipeline expansion + Snakemake | Weeks 1–3 | ~$150 |
| B | GCS hardening + idle improvements | Weeks 2–4 | ~$50 |
| C | SLURM + NFS adapters | Weeks 5–10 | ~$500 |
| D | Metadata + provenance | Weeks 4–8 | ~$30 |
| E | Multi-tenant hosted version | Weeks 12–20 | ~$800 |

**Phases A–D can overlap.** Core platform enhancements (A–D) target ~10 weeks. Multi-tenant (E) follows once the open-source product is feature-complete.

**Total estimated infrastructure cost through hosted MVP: ~$1,500**

*Note: All timeline estimates assume solo full-time development. Infrastructure costs are GCP development/testing only — does not include production hosting.*

---

## Community & GTM (Ongoing, Parallel)

- Onboard 5–10 biotech startups / academic labs on open-source version
- Build feedback loop: bug reports → feature votes → roadmap prioritization
- Publish case studies from early adopters
- Target bioinformatics communities (Biostars, nf-core Slack, Twitter/X)
- Offer free deployment assistance to first 10 labs (consulting pipeline)
