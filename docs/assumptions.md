# Assumptions

- Policies are preconfigured before claim submission
- Claims become immutable after adjudication completion
- MongoDB is used due to flexible document-based policy and claim structures
- System is implemented as a modular monolith for assignment scope
- Deductible is applied once per claim
- Claim line items are embedded within the claim document
- Excluded services are always fully rejected
- Annual limit validation occurs after deductible calculation
- Policies are assumed to belong to a single member
- Claims are processed synchronously for simplified workflow handling
- Duplicate claim detection uses policyId + incidentDate
- Claims are adjudicated immediately upon submission
- Policy coverage is determined using coverageTypes matching line-item serviceType
- Appeals and manual review workflows are outside assignment scope