# Celsius – Distributed MongoDB Cloud System (Multi-Region)

## Overview
Celsius is a portfolio reconstruction of a database systems project where we designed a multi-region data platform to support operations across **Japan, the United States, and Argentina**. The system uses a **sharded MongoDB cluster** and emphasizes data integrity through **schema validation**, **stored procedures**, and **explain plan** analysis.

This repo focuses on the system design choices and the core database logic that powers a realistic business workflow (contracts, billing, labor rates, and regional operations).

---

## What This System Solves
The business needs a database that can:
- Support global regions with different operational constraints
- Track contracts, billing, and profitability
- Enforce business rules (ex: max hours per project)
- Produce reliable reporting (billing by region, active contracts, profit)

---

## Architecture (High Level)
- **3 Regions (conceptual):** Japan, United States, Argentina  
- **Database:** MongoDB (Sharded Cluster)
- **Core Features:**
  - Sharding for scalability
  - Validation rules for data quality
  - Stored procedures (MongoDB functions) for reusable business logic
  - Aggregation pipelines for analytics reporting
  - Explain plans to reason about performance

(See `/architecture` for the diagram.)

---

## Data Model (Collections)
- `clients`
- `client_contracts` (billing, payment, profit tracking)
- `projects`
- `timecards`
- `labor_rates` (linked to role + region)
- `regions`
- `contract_requests` (enforces Max_num_hrs ≤ 25 per project)

---

## Stored Procedures
- `calculateProfit` – computes contract profit using billing vs labor cost
- `getClientContracts` – fetches contracts with client + project context
- `billingByRegion` – aggregates billing metrics by region

See `/procedures`.

---

## Validation Rules
Schema validation helps prevent bad data from entering critical collections (ex: hours cap per project).  
See `/schemas/validation_rules.js`.

---

## Example Analytics Outputs
- Billing by region (aggregation pipeline)
- Top clients by revenue
- Profitability by contract type
- Contract capacity and hours utilization

See `/queries`.

---

## What I Contributed / Owned
- Designed the multi-region sharded architecture concept
- Implemented schema validation rules and business constraints
- Built stored procedures for financial and contract logic
- Wrote aggregation pipelines and explain plan analysis for performance reasoning

---

## Tech Stack
MongoDB • Aggregation Pipelines • Validation Rules • Stored Procedures • Explain Plans

---

## Notes
This repository is a clean, portfolio-ready reconstruction based on the original course implementation and is designed to clearly demonstrate database architecture and query engineering skills.
