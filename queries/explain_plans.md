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
