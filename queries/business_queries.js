// queries/business_queries.js
// Example business queries for the Celsius Distributed MongoDB System

use celsius_project;

// 1) Top clients by payments received
db.client_contracts.aggregate([
  { $group: { _id: "$client_id", total_paid: { $sum: "$payment_received" }, contracts: { $sum: 1 } } },
  { $sort: { total_paid: -1 } },
  { $limit: 10 },
  {
    $lookup: {
      from: "clients",
      localField: "_id",
      foreignField: "client_id",
      as: "client"
    }
  },
  { $unwind: { path: "$client", preserveNullAndEmptyArrays: true } },
  {
    $project: {
      _id: 0,
      client_id: "$_id",
      client_name: "$client.name",
      total_paid: 1,
      contracts: 1
    }
  }
]);

// 2) Contracts at risk: high billing but low payment received (payment gap)
db.client_contracts.aggregate([
  { $addFields: { payment_gap: { $subtract: ["$billing_amount", "$payment_received"] } } },
  { $match: { payment_gap: { $gt: 1000 } } },
  { $sort: { payment_gap: -1 } },
  { $limit: 20 },
  {
    $project: {
      _id: 0,
      contract_id: 1,
      client_id: 1,
      project_id: 1,
      region_code: 1,
      billing_amount: 1,
      payment_received: 1,
      payment_gap: 1
    }
  }
]);

// 3) Coverage check: pending requests missing a matching labor_rate for role + region
db.contract_requests.aggregate([
  { $match: { status: "PENDING" } },
  {
    $lookup: {
      from: "labor_rates",
      let: { role: "$role_id", region: "$region_code" },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $eq: ["$role_id", "$$role"] },
                { $eq: ["$region_code", "$$region"] }
              ]
            }
          }
        }
      ],
      as: "rate_match"
    }
  },
  { $match: { rate_match: { $size: 0 } } },
  {
    $project: {
      _id: 0,
      request_id: 1,
      project_id: 1,
      region_code: 1,
      role_id: 1,
      max_num_hrs: 1,
      status: 1
    }
  }
]);

Add business queries for reporting and validation

