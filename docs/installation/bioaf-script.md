---
layout: docs
title: The bioaf Script
description: Reference guide for all bioaf management script commands.
---

The `bioaf` script is the primary tool for managing your bioAF installation. It handles everything from first-time setup to day-to-day operations — starting and stopping services, running database migrations, creating backups, and more.

All commands are run from the root of your bioAF installation:

```bash
./bioaf <command> [options]
```

---

## First-run

### `setup`

```bash
./bioaf setup
```

The interactive first-time setup wizard. Prompts for your organization name, admin email, and admin password, then:

- Generates a secure `.env` configuration file
- Provisions TLS certificates
- Builds all container images
- Starts all services
- Runs database migrations
- Creates the initial admin account

Run this once when you first install bioAF. For subsequent installs or to create additional admin accounts, use `create-admin`.

### `create-admin`

```bash
./bioaf create-admin
```

Creates a new admin user account interactively. Services must already be running. Prompts for organization name, email, and password.

---

## Service management

### `start`

```bash
./bioaf start
```

Starts all services in the correct order: database, backend API, frontend, and web server. Waits for each service to be ready before starting the next.

### `stop`

```bash
./bioaf stop
```

Gracefully stops all services in reverse order.

### `restart`

```bash
./bioaf restart
```

Stops all services, then starts them again. Equivalent to running `stop` followed by `start`.

### `status`

```bash
./bioaf status
```

Shows the current state of each service — running, stopped, or unknown.

### `logs`

```bash
./bioaf logs
./bioaf logs <service>
./bioaf logs <service> -n <lines>
```

Streams live logs from all services, or from a specific service if named. Defaults to the last 100 lines.

| Option | Description |
|--------|-------------|
| `<service>` | One of: `db`, `backend`, `frontend`, `nginx` |
| `-n <lines>` | Number of historical lines to show before streaming (default: 100) |

**Examples:**
```bash
./bioaf logs backend          # Stream backend logs
./bioaf logs backend -n 500   # Stream backend logs, starting from last 500 lines
./bioaf logs nginx            # Stream web server logs
```

### `build`

```bash
./bioaf build
./bioaf build <service>
```

Builds (or rebuilds) container images. Run this after pulling updates or modifying configuration. Optionally specify a single service to build only that image.

---

## Database

### `migrate`

```bash
./bioaf migrate
```

Runs any pending database migrations. Safe to run multiple times — already-applied migrations are skipped. Run this after updating bioAF to apply schema changes.

### `migrate-down`

```bash
./bioaf migrate-down <revision>
```

Downgrades the database schema to a specific revision. Used for rollbacks.

{% include info-bubble.html title="When would I need this?" content="If an update introduces a database change that causes problems, migrate-down lets you roll the schema back to the previous state. You would typically use this alongside reverting the code to the previous version. Only use this if directed to do so during a troubleshooting or rollback procedure." %}

### `backup`

```bash
./bioaf backup
```

Creates a compressed database backup (`pg_dump`) and uploads it to the `bioaf-backups-{project_id}` GCS bucket. The backup file is timestamped, e.g. `bioaf_20260403_142500.sql.gz`. Retention and rotation are configurable in Admin > Backup Settings.

Run this before major updates or any operation that modifies data.

### `seed`

```bash
./bioaf seed <script.py>
```

Runs a data script inside the backend container. Used to load demo data or perform one-off data operations. Running `./bioaf seed` without a script name lists available scripts.

### `reset-db`

```bash
./bioaf reset-db
```

**Destructive.** Drops and recreates the database, then runs migrations from scratch. Requires typing `yes` to confirm. All data is permanently lost.

Use this only during development or to fully reset a broken installation. Not for production use.

---

## Debugging

### `shell`

```bash
./bioaf shell
./bioaf shell <service>
```

Opens an interactive shell inside a running container. Defaults to the `backend` container. Useful for inspecting the running environment or running one-off commands.

| Service | What you get |
|---------|-------------|
| `backend` | Python environment with full app context |
| `frontend` | Node.js environment |
| `db` | Linux shell inside the database container |
| `nginx` | Linux shell inside the web server container |

### `dbshell`

```bash
./bioaf dbshell
```

Opens a direct `psql` session to the database. Useful for inspecting data or running SQL queries directly.

---

## Pipeline

### `register-outputs`

```bash
./bioaf register-outputs
./bioaf register-outputs --run-id <id>
./bioaf register-outputs --force
```

Scans GCS for pipeline output files and registers them in the database. Normally this happens automatically when a pipeline completes — use this command if outputs are missing from the UI or if a pipeline completed without registering its results.

| Option | Description |
|--------|-------------|
| `--run-id <id>` | Register outputs for a specific pipeline run only |
| `--force` | Re-register files that are already in the database |

---

## Maintenance

### `update`

```bash
./bioaf update
```

Updates bioAF to the latest version in one step:

1. Pulls the latest code from GitHub
2. Rebuilds container images
3. Restarts services
4. Runs any new database migrations

Run `./bioaf backup` before updating.

### `help`

```bash
./bioaf help
./bioaf -h
./bioaf --help
```

Prints a summary of all available commands with usage examples.
