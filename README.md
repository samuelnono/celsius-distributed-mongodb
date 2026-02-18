# Celsius Distributed MongoDB System

## Overview

This project simulates a multi-region distributed MongoDB deployment representing geographic warehouses (Argentina, Japan, United States).

The system focuses on:

- Business rule enforcement using schema validation
- Stored procedures for financial calculations
- Aggregation pipelines for reporting
- Performance validation using MongoDB explain plans
- Indexing strategies aligned with query patterns
- Architectural reasoning for distributed systems

---

## Architecture Summary

Each virtual machine represents a geographic region.

Collections include:

- client_contracts
- contract_requests
- labor_rates
- clients
- projects
- regions

Compound indexes are used to support common filtered queries such as region + status dashboards.

---

## Business Logic Functions

Implemented MongoDB functions:

- calculateProfit(contractId)
- getClientContracts(clientId, limit)
- billingByRegion()

These functions simulate production-style business logic inside MongoDB.

---

## Schema Validation

Schema rules enforce:

- max_num_hrs ≤ 25 in contract_requests
- Required fields validation
- Controlled status enum values

This ensures business constraints are enforced at the database level.

---

## Performance Optimization

Explain plans were used to evaluate:

- Documents examined
- Execution time
- Index usage
- Query planner decisions (IXSCAN vs COLLSCAN)

Indexes implemented:

- client_contracts(client_id)
- client_contracts(region_code, status)
- contract_requests(project_id, region_code)
- labor_rates(role_id, region_code)

---

## Before vs After Indexing

| Metric | Before Index | After Index |
|--------|--------------|------------|
| Docs Examined | High (Full Scan) | Low (Targeted Scan) |
| Execution Time | Slower | Faster |
| Query Plan | COLLSCAN | IXSCAN |
| Scalability | Limited | Scales Across Regions |

---

## Scalability Considerations

- Indexes aligned with regional query patterns
- Compound indexes support filtered dashboards
- Architecture supports future sharding by region_code
- Designed to scale under increasing contract volume

---

## Future Improvements

- Implement shard keys aligned with region_code
- Add partial indexes for active contracts
- Introduce monitoring metrics for production environments

---

## Author

Samuel Nono  
M.S. Data Science  
Focus: Data Engineering | Distributed Systems | Backend Optimization
