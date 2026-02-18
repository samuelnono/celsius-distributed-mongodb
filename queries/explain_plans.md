# Explain Plans (Performance Reasoning)

This section documents how query performance is evaluated using MongoDB `explain()` and indexing strategy.

---

## Why Explain Plans Matter

In a distributed MongoDB environment (multi-region VM deployment), inefficient queries can:

- Trigger full collection scans (`COLLSCAN`)
- Increase network latency across regions
- Inflate CPU and memory usage
- Slow down dashboard reporting

Using `explain("executionStats")` allows us to measure:

- Documents examined
- Documents returned
- Execution time
- Index usage
- Whether the query planner selected an efficient plan

---

## Example 1: Billing by Region (Aggregation)

```js
db.client_contracts
  .explain("executionStats")
  .aggregate([
    { 
      $group: { 
        _id: "$region_code", 
        total_paid: { $sum: "$payment_received" } 
      } 
    }
  ])

---

## What to Evaluate

- Does the plan show `COLLSCAN`?
- How many documents were examined?
- What is the execution time?
- Is there an index that supports common filters like `region_code`?

---

## Example 2: Find Contracts by Client ID

```js
db.client_contracts
  .explain("executionStats")
  .find({ client_id: "C-1001" })

---

## Performance Optimization (Indexing Strategy)

To reduce full collection scans and improve dashboard query performance, create indexes aligned with common access patterns:

```js
db.client_contracts.createIndex({ client_id: 1 })
db.client_contracts.createIndex({ region_code: 1, status: 1 })
db.contract_requests.createIndex({ project_id: 1, region_code: 1 })
db.labor_rates.createIndex({ role_id: 1, region_code: 1 })

After index creation, rerun the same query using:

```js
.explain("executionStats")

Compare:

- executionStats.executionTimeMillis
- executionStats.totalDocsExamined
- Confirm the query plan uses `IXSCAN` instead of `COLLSCAN`

---

## Before vs After Indexing Strategy

| Metric | Before Index | After Index |
|--------|--------------|------------|
| Docs Examined | High (Full Scan) | Low (Targeted Scan) |
| Execution Time | Slower | Faster |
| Query Plan | COLLSCAN | IXSCAN |
| Scalability | Limited | Scales Across Regions |

---

## Architectural Consideration (Multi-Region VM Deployment)

Because each virtual machine represents a geographic warehouse (Argentina, Japan, United States):

- Indexes must align with regional query patterns
- Compound indexes support filtered dashboard queries (e.g., region + status)
- Performance validation should be tested independently per region
- Index efficiency directly impacts cross-region latency

---

## Conclusion

Explain plans validate that:

- Business queries scale properly
- Aggregation pipelines remain efficient
- The distributed MongoDB architecture remains performant under growth

Future improvements:

- Add shard keys aligned with `region_code`
- Implement partial indexes for active contracts
- Monitor query performance using production-like metrics

