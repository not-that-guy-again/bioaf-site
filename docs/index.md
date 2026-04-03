---
layout: docs
title: Getting Started
description: Get up and running with bioAF in under 30 minutes.
---

Welcome to bioAF. This guide will get you from zero to a working computational biology platform on your own Google Cloud project.

## What you'll have when you're done

- A web-based control plane for your entire comp bio workflow
- Pipeline execution (Nextflow, Snakemake) with a built-in catalog
- Notebook sessions (JupyterHub, RStudio) with versioned environments
- Structured experiment and sample tracking
- Interactive results visualization (cellxgene, QC dashboards)
- Cost monitoring and audit logging

## Quick start

```bash
git clone https://github.com/not-that-guy-again/bioAF.git
cd bioAF
./bioaf setup
```

The `setup` command walks you through everything interactively: it checks your prerequisites, generates configuration, builds the platform, runs database migrations, and creates your admin account.

{% include info-bubble.html title="What does setup actually do?" content="It checks that Docker and Git are installed, generates a `.env` file with secure credentials, builds container images for the backend, frontend, and database, applies database schema migrations, and prompts you to create an admin user. The whole process takes about 10 minutes depending on your internet connection." %}

## Next steps

1. **[Prerequisites](installation/prerequisites/)** — What you need before running setup
2. **[Setup & Deploy](installation/setup/)** — Step-by-step installation walkthrough
3. **[Post-Setup](installation/post-setup/)** — Enable components and invite your team

Once you're up and running, check the guide for your role:

- **[For Bench Scientists](user-guides/bench-scientists/)** — Register experiments, upload data, view results
- **[For Bioinformaticians](user-guides/bioinformaticians/)** — Run pipelines, launch notebooks, manage environments
- **[For PIs & Lab Managers](user-guides/pis-and-lab-managers/)** — Track progress, monitor costs, review audits
