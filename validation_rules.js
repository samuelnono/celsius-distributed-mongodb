// schemas/validation_rules.js
// Schema validation rules for Celsius Distributed MongoDB System

use celsius_project;

// Enforce Max_num_hrs <= 25 per project in contract_requests
db.runCommand({
  collMod: "contract_requests",
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["request_id", "project_id", "region_code", "role_id", "max_num_hrs", "status"],
      properties: {
        request_id: { bsonType: "string" },
        project_id: { bsonType: "string" },
        region_code: { bsonType: "string" },
        role_id: { bsonType: "string" },
        max_num_hrs: {
          bsonType: "int",
          minimum: 1,
          maximum: 25,
          description: "Business rule: Max_num_hrs must not exceed 25"
        },
        status: {
          enum: ["PENDING", "APPROVED", "REJECTED"]
        }
      }
    }
  },
  validationLevel: "strict",
  validationAction: "error"
});
Add contract_requests validation rule (Max_num_hrs <= 25)
