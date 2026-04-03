---
layout: docs
title: Experiment Management
description: Structured experiment tracking with MINSEQE-compliant metadata in bioAF.
---

bioAF provides structured experiment and sample management that follows community metadata standards and tracks the full lifecycle from bench to publication.

## Structured metadata

Every experiment in bioAF captures MINSEQE-compliant metadata:

- Organism, tissue type, and cell type
- Sequencing chemistry and platform
- Experimental conditions and treatments
- Library preparation details

This metadata travels with your data through every step — from sample registration to pipeline execution to final results — so nothing is lost.

## Sample management

Samples are organized within experiments and can be grouped into **batches** for processing. Each sample carries:

- Descriptive metadata (tissue, treatment, conditions)
- Processing status
- Links to uploaded FASTQ files
- Links to pipeline results

<!-- TODO: Screenshot of experiment detail page showing samples -->
<div class="screenshot">Screenshot: Experiment detail page with sample table, batch groupings, and status indicators</div>

## Experiment lifecycle

Every experiment moves through a defined status workflow:

**Registered** → **Library Prep** → **Sequencing** → **FASTQ Uploaded** → **Processing** → **Pipeline Complete** → **Reviewed** → **Analysis** → **Complete**

The current status is always visible, and every status transition is recorded in the audit log.

## GEO submission export

When you're ready to publish, bioAF can export your experiment metadata in formats compatible with GEO submission, including Excel spreadsheets with all required fields pre-populated.
