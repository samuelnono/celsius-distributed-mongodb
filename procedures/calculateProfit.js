// procedures/calculateProfit.js
// MongoDB Function: calculateProfit(contractId)
// Calculates profit metrics for a given contract_id.

use celsius_project;

db.system.js.save({
  _id: "calculateProfit",
  value: function (contractId) {

    const contract = db.client_contracts.findOne({ contract_id: contractId });

    if (!contract) {
      return { ok: false, message: "Contract not found", contract_id: contractId };
    }

    const billing = contract.billing_amount || 0;
    const paid = contract.payment_received || 0;
    const labor = contract.labor_cost || 0;

    const profit = paid - labor;
    const margin = paid === 0 ? null : profit / paid;

    db.client_contracts.updateOne(
      { contract_id: contractId },
      {
        $set: {
          profit_amount: profit,
          profit_margin: margin,
          profit_last_calculated_at: new Date()
        }
      }
    );

    return {
      ok: true,
      contract_id: contractId,
      billing_amount: billing,
      payment_received: paid,
      labor_cost: labor,
      profit_amount: profit,
      profit_margin: margin
    };
  }
});
Add calculateProfit MongoDB function

