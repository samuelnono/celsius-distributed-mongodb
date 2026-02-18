// queries/aggregation_reports.js
// Reporting-style aggregations for dashboards / stakeholder reporting

use celsius_project;

// Report 1: Profitability by region and contract status
db.client_contracts.aggregate([
  {
    $group: {
      _id: { region_code: "$region_code", status: "$status" },
      total_paid: { $sum: "$payment_received" },
      total_labor_cost: { $sum: "$labor_cost" },
      contracts: { $sum: 1 }
    }
  },
  { $addFields: { total_profit: { $subtract: ["$total_paid", "$total_labor_cost"] } } },
  { $sort: { " _id.region_code": 1, total_profit: -1 } },
  {
    $project: {
      _id: 0,
      region_code: "$_id.region_code",
      status: "$_id.status",
      contracts: 1,
      total_paid: 1,
      total_labor_cost: 1,
      total_profit: 1
    }
  }
]);

// Report 2: Project billing + timecards rollup (example of dashboard output)
db.projects.aggregate([
  {
    $lookup: {
      from: "client_contracts",
      localField: "project_id",
      foreignField: "project_id",
      as: "contracts"
    }
  },
  {
    $lookup: {
      from: "timecards",
      localField: "project_id",
      foreignField: "project_id",
      as: "timecards"
    }
  },
  {
    $addFields: {
      total_billing: { $sum: "$contracts.billing_amount" },
      total_paid: { $sum: "$contracts.payment_received" },
      total_labor_cost: { $sum: "$contracts.labor_cost" },
      total_hours_logged: { $sum: "$timecards.hours" }
    }
  },
  { $addFields: { total_profit: { $subtract: ["$total_paid", "$total_labor_cost"] } } },
  { $sort: { total_paid: -1 } },
  { $limit: 20 },
  {
    $project: {
      _id: 0,
      project_id: 1,
      name: 1,
      region_code: 1,
      total_billing: 1,
      total_paid: 1,
      total_labor_cost: 1,
      total_profit: 1,
      total_hours_logged: 1
    }
  }
]);


Add aggregation report pipelines

