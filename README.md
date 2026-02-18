#  Celsius Distributed MongoDB System

> Multi-Region Distributed Database Architecture  
> Focus: Performance Optimization, Index Strategy, and Backend Business Logic

---

## 🌍 System Overview

This project simulates a distributed MongoDB deployment across:

- 🇦🇷 Argentina
- 🇯🇵 Japan
- 🇺🇸 United States

Each virtual machine represents a geographic warehouse.

The architecture was designed to test:

- Schema validation rules
- Stored business logic
- Aggregation-based reporting
- Index-driven performance optimization
- Explain plan performance validation

---

## 🏗 Architecture Design

### Core Collections
- `client_contracts`
- `contract_requests`
- `labor_rates`
- `clients`
- `projects`
- `regions`

### Distributed Consideration
Indexes were aligned with regional query patterns to reduce cross-region latency.

---

## ⚙️ Business Logic (MongoDB Functions)

Production-style server-side logic implemented:

- `calculateProfit(contractId)`
- `getClientContracts(clientId, limit)`
- `billingByRegion()`

These simulate financial computation and reporting pipelines inside the database.

---

## 🛡 Schema Enforcement

Business rules enforced at the database layer:

- `max_num_hrs ≤ 25`
- Required fields validation
- Controlled enum status values
- Strict validation level

This prevents invalid operational data from entering the system.

---

## 📊 Performance Optimization

### Explain Plan Validation

Used:

.explain("executionStats")


Measured:

- Documents examined
- Execution time
- Index usage
- Query plan (IXSCAN vs COLLSCAN)

---

## 📈 Index Strategy

db.client_contracts.createIndex({ client_id: 1 })

db.client_contracts.createIndex({ region_code: 1, status: 1 })

db.contract_requests.createIndex({ project_id: 1, region_code: 1 })

db.labor_rates.createIndex({ role_id: 1, region_code: 1 })


---

## 🔬 Before vs After Indexing

| Metric | Before | After |
|--------|--------|--------|
| Docs Examined | Full Scan | Targeted |
| Execution Time | Slower | Faster |
| Query Plan | COLLSCAN | IXSCAN |
| Scalability | Limited | Regional Scale |

---

## 🧠 Architectural Reasoning

Because each VM represents a geographic warehouse:

- Compound indexes support region + status dashboards
- Index efficiency reduces cross-region latency
- Query validation must be tested per region
- Architecture supports future sharding by `region_code`

---

## 🚀 Future Scalability Improvements

- Implement shard keys aligned with region_code
- Add partial indexes for active contracts
- Introduce production performance monitoring
- Add query latency benchmarking

---

## 👤 Author

**Samuel Nono**  
M.S. Data Science  
Backend Systems | Data Engineering | Distributed Architecture


