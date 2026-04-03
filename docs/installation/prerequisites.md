---
layout: docs
title: Prerequisites
description: What you need before installing bioAF.
---

Before running bioAF setup, make sure you have the following.

## Required software

| Tool | Minimum version | What it's for |
|------|----------------|---------------|
| **Git** | 2.x | Cloning the bioAF repository |
| **Docker** | 20.x | Running the platform containers |
| **Docker Compose** | v2.x | Orchestrating the services |

{% include info-bubble.html title="How do I check my versions?" content="Run `git --version`, `docker --version`, and `docker compose version` in your terminal. If any of these aren't installed, your IT team or system administrator can help — they're standard tools available on Mac, Windows, and Linux." %}

## Google Cloud Platform

You'll need a GCP project with billing enabled. bioAF provisions infrastructure in your project, so you maintain full ownership of your data and compute.

- A GCP project (new or existing)
- Billing enabled on the project
- The `gcloud` CLI installed and authenticated

{% include info-bubble.html title="What is GCP?" content="Google Cloud Platform is Google's cloud computing service. It provides the servers, storage, and networking that bioAF uses to run your pipelines and store your data. You pay Google directly for what you use — bioAF itself is free." %}

## What you'll need on hand

- A GCP project ID (looks like `my-project-123456`)
- An email address for the admin account
- About 30 minutes

## Expected cloud costs

bioAF is free. Running it on Google Cloud Platform is not — you'll pay Google directly for the infrastructure it uses (compute, database, storage). Costs scale with usage: more pipeline runs and notebook sessions mean higher bills; an idle platform costs very little.

Optional components (notebook sessions, additional pipeline engines, search) add cost based on usage. You can enable and disable them at any time from the bioAF UI, and you'll see cost estimates before you provision anything.

See [What to Expect on Your GCP Bill]({{ '/docs/installation/gcp-costs/' | relative_url }}) for a full breakdown.

{% include info-bubble.html title="Why does it cost anything if bioAF is free?" content="bioAF the software is free and open source. These costs come from Google Cloud Platform for the servers, database, and storage that the platform runs on — similar to how a free email app still needs you to pay your internet bill." %}
