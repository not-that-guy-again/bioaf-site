---
layout: docs
title: Setup & Deploy
description: Step-by-step guide to installing and deploying bioAF.
---

## One-command setup

The fastest way to get started:

```bash
git clone https://github.com/not-that-guy-again/bioAF.git
cd bioAF
./bioaf setup
```

The setup command is interactive — it will prompt you for your GCP project ID, generate secure credentials, build the platform, and create your admin account.

## Step-by-step setup

If you prefer to run each step individually:

### 1. Clone the repository

```bash
git clone https://github.com/not-that-guy-again/bioAF.git
cd bioAF
```

### 2. Run the installer

```bash
./install.sh
```

This checks your prerequisites and generates the configuration file at `docker/.env` with secure, randomly-generated credentials.

### 3. Build the platform

```bash
./bioaf build
```

Builds the Docker images for the backend, frontend, and supporting services.

<img src="{{ '/assets/images/screenshot-build.png' | relative_url }}" alt="Terminal output during ./bioaf build" class="screenshot-img">

### 4. Start the services

```bash
./bioaf start
```

Starts the database, backend API, frontend, and web server.

### 5. Run database migrations

```bash
./bioaf migrate
```

Sets up the database schema. This only needs to run once on first install (and again after updates).

### 6. Create your admin account

```bash
./bioaf create-admin
```

You'll be prompted for an email and password. This creates the first user with full administrator access.

### 7. Open bioAF

Navigate to `https://<your-server-ip>` in your browser and log in with your admin credentials. The setup command will print the exact URL when it completes.

<img src="{{ '/assets/images/screenshot-login.png' | relative_url }}" alt="bioAF login page" class="screenshot-img">

## Useful commands

| Command | What it does |
|---------|-------------|
| `./bioaf status` | Show which services are running |
| `./bioaf logs` | Tail the logs from all services |
| `./bioaf logs backend` | Tail logs from a specific service |
| `./bioaf stop` | Stop all services |
| `./bioaf restart` | Restart all services |
| `./bioaf update` | Pull the latest version, rebuild, and migrate |

## Troubleshooting

**"Docker is not running"** — Make sure Docker Desktop (or the Docker daemon) is started before running setup.

**"Port 443 is already in use"** — Another application is using port 443. Stop it, or edit `docker/.env` to change the port.

**Build fails with network errors** — Check your internet connection. The build needs to download base images and dependencies.

If you run into other issues, check the [FAQ]({{ '/docs/faq/' | relative_url }}) or [open an issue on GitHub](https://github.com/not-that-guy-again/bioAF/issues).
