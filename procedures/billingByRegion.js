// procedures/billingByRegion.js
// MongoDB Function: billingByRegion()
// Aggregates billing and profitability by region_code.

use celsius_project;

db.system.js.save({
  _id: "billingByRegion",
  value: function () {

    const pipeline = [
      {
        $group: {
          _id: "$region_code",
          total_billing: { $sum: "$billing_amount" },
          total_paid: { $sum: "$payment_received" },
          total_labor_cost: { $sum: "$labor_cost" },
          contracts: { $sum: 1 }
        }
      },
      {
        $addFields: {
          total_profit: { $subtract: ["$total_paid", "$total_labor_cost"] },
          avg_paid_per_contract: {
            $cond: [
              { $eq: ["$contracts", 0] },
              0,
              { $divide: ["$total_paid", "$contracts"] }
            ]
          }
        }
      },
      { $sort: { total_paid: -1 } },
      {
        $project: {
          _id: 0,
          region_code: "$_id",
          contracts: 1,
          total_billing: 1,
          total_paid: 1,
          total_labor_cost: 1,
          total_profit: 1,
          avg_paid_per_contract: 1
        }
      }
    ];

    return db.client_contracts.aggregate(pipeline).toArray();
  }
});

Add billingByRegion MongoDB function

