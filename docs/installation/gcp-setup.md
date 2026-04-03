---
layout: docs
title: Deploying on Google Cloud (GCE)
description: A step-by-step guide to deploying bioAF on a Google Cloud virtual machine — no prior cloud experience needed.
---

This guide walks you through deploying bioAF on Google Cloud Platform from scratch. If you've never used GCP before, start here.

{% include info-bubble.html title="What is Google Cloud Platform?" content="Google Cloud Platform (GCP) is Google's cloud computing service. It rents you servers, storage, and networking infrastructure that you pay for by the hour or by the gigabyte. bioAF runs on GCP — you own your data and your infrastructure, and you pay Google directly for what you use." %}

---

## Step 1: Create a Google Cloud account

1. Go to [cloud.google.com](https://cloud.google.com) and click **Get started for free**
2. Sign in with a Google account (or create one)
3. Follow the prompts to complete account creation

Google provides a free trial credit for new accounts that covers initial setup and experimentation.

---

## Step 2: Set up billing

Before GCP will let you create infrastructure, you need a billing account attached to a payment method.

1. In the GCP Console, open the navigation menu (&#9776;) and go to **Billing**
2. Click **Add billing account**
3. Enter your organization name and payment information
4. Click **Submit and enable billing**

{% include info-bubble.html title="Why do I need a credit card for free software?" content="bioAF is free. But it runs on Google's servers, which aren't free. You pay Google directly for the compute, storage, and database resources bioAF uses — similar to paying an electric bill for hardware you own. Google requires a payment method on file before they'll provision any infrastructure." %}

---

## Step 3: Create a project

GCP organizes everything into projects. Think of a project as a container for all the infrastructure bioAF will use.

1. In the GCP Console, click the project dropdown at the top of the page
2. Click **New Project**
3. Give it a name (e.g., `bioaf-prod` or `my-lab-bioaf`)
4. Select your billing account
5. Click **Create**

Make note of your **Project ID** — it's the unique identifier GCP assigns (e.g., `bioaf-prod-123456`). You'll need it during setup.

---

## Step 4: Create a service account

A service account is a special account that bioAF uses to create and manage infrastructure on your behalf — without needing your personal credentials.

1. In the GCP Console, go to **IAM & Admin > Service Accounts**
2. Click **Create Service Account**
3. Name it `bioaf-admin` and give it a description like "bioAF infrastructure account"
4. Click **Create and Continue**

{% include info-bubble.html title="What is a service account?" content="A service account is like a key card for a program. Instead of using your personal login, bioAF uses this key card to interact with GCP on your behalf. This is more secure than sharing your personal credentials, and you can revoke it at any time." %}

---

## Step 5: Add roles to the service account

Roles define what the service account is allowed to do. bioAF needs permission to create and manage the resources it provisions.

On the **Grant this service account access to the project** screen:

1. Click **Add role** and add each of the following:

| Role | Why it's needed |
|------|----------------|
| **Editor** | Allows creating and managing most GCP resources |
| **Security Admin** | Allows managing IAM policies for provisioned resources |
| **Service Account Token Creator** | Allows bioAF to generate short-lived credentials |

2. Click **Continue**, then **Done**

{% include info-bubble.html title="bioAF will guide you on additional permissions" content="During setup, bioAF checks your service account's permissions against the features you have enabled. If anything is missing, it will tell you exactly which roles to add and why. The three roles above are the minimum to get started." %}

**Download a key:**

1. Click on the `bioaf-admin` service account you just created
2. Go to the **Keys** tab
3. Click **Add Key > Create new key**
4. Choose **JSON** and click **Create**
5. Save the downloaded file somewhere safe — you'll need it during bioAF setup

{% include info-bubble.html title="Keep that key file safe" content="The JSON key file gives whoever holds it full access to your GCP project. Don't commit it to GitHub, share it over email, or leave it in a public location. Store it somewhere only you can access, like a password manager or a secure folder on your machine." %}

---

## Step 6: Install the gcloud CLI

The `gcloud` CLI is a command-line tool that lets you interact with GCP from your terminal. bioAF uses it during setup.

**On Mac:**
```bash
brew install --cask google-cloud-sdk
```

**On Linux:**
```bash
curl https://sdk.cloud.google.com | bash
exec -l $SHELL
```

**On Windows:** Download the installer from [cloud.google.com/sdk](https://cloud.google.com/sdk/docs/install).

After installing, authenticate:
```bash
gcloud auth login
gcloud config set project YOUR_PROJECT_ID
```

Replace `YOUR_PROJECT_ID` with the project ID from Step 3.

---

## Step 7: Create a GCE virtual machine

You'll run bioAF's control plane on a small virtual machine in GCP. This VM is always-on and handles the web interface, API, and database.

1. In the GCP Console, go to **Compute Engine > VM Instances**
2. Click **Create Instance**
3. Configure the instance:

| Setting | Value |
|---------|-------|
| **Name** | `bioaf-server` |
| **Region** | Choose one close to your team |
| **Machine type** | `e2-standard-2` (2 vCPU, 8 GB RAM) |
| **Boot disk** | Ubuntu 22.04 LTS, 50 GB |
| **Firewall** | Check both **Allow HTTP** and **Allow HTTPS** |

4. Click **Create**

Wait about a minute for the instance to start.

{% include info-bubble.html title="What is a virtual machine?" content="A virtual machine (VM) is a computer that runs inside Google's data center. It behaves exactly like a regular computer — it has a processor, memory, storage, and an operating system — but you access it over the internet instead of sitting in front of it. Your bioAF control plane (the web interface and API) runs here." %}

---

## Step 8: Connect to your VM

1. In the VM Instances list, find `bioaf-server` and click the **SSH** button in the Connect column
2. A browser-based terminal will open, connected to your VM

Alternatively, use the gcloud CLI:
```bash
gcloud compute ssh bioaf-server --zone YOUR_ZONE
```

---

## Step 9: Install Docker and Git

Once connected to the VM, install the required dependencies:

```bash
# Update packages
sudo apt-get update

# Install Git
sudo apt-get install -y git

# Install Docker
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER

# Apply group change without logging out
newgrp docker
```

---

## Step 10: Install bioAF

```bash
git clone https://github.com/not-that-guy-again/bioAF.git
cd bioAF
./bioaf setup
```

The setup command will prompt you for:
- Your GCP project ID
- The path to your service account JSON key file (from Step 5)
- An email and password for the admin account

Setup takes about 30 minutes. At the end, it will print the URL where bioAF is running.

{% include info-bubble.html title="What is bioaf setup doing?" content="The setup command checks your prerequisites, generates secure credentials, builds the Docker containers for the web interface, API, and database, runs database migrations, and provisions your GCP infrastructure using the service account you created. It's all automated — you just answer the prompts." %}

---

## Next steps

Once setup completes:

- Log in at the URL printed by the setup command
- Follow the [Post-Setup guide]({{ '/docs/installation/post-setup/' | relative_url }}) to enable components and invite your team
- Point your team to the [user guide for their role]({{ '/docs/' | relative_url }})
