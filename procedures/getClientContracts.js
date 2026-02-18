// procedures/getClientContracts.js
// MongoDB Function: getClientContracts(clientId, limit)
// Fetches contracts for a given client_id with basic joined context.

use celsius_project;

db.system.js.save({
  _id: "getClientContracts",
  value: function (clientId, limit) {
    limit = limit || 25;

    const pipeline = [
      { $match: { client_id: clientId } },
      {
        $lookup: {
          from: "clients",
          localField: "client_id",
          foreignField: "client_id",
          as: "client"
        }
      },
      { $unwind: { path: "$client", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "projects",
          localField: "project_id",
          foreignField: "project_id",
          as: "project"
        }
      },
      { $unwind: { path: "$project", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 0,
          contract_id: 1,
          region_code: 1,
          status: 1,
          billing_amount: 1,
          payment_received: 1,
          labor_cost: 1,
          profit_amount: 1,
          profit_margin: 1,
          "client.client_id": 1,
          "client.name": 1,
          "project.project_id": 1,
          "project.name": 1
        }
      },
      { $sort: { contract_id: 1 } },
      { $limit: limit }
    ];

    return db.client_contracts.aggregate(pipeline).toArray();
  }
});
