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

# Business & Technical Assumptions

Given the open-ended nature of the assignment, I made the following assumptions to constrain the scope and deliver a functional product:

1. **The User Persona:** I assumed the primary user of this system is an internal Insurance Claims Adjuster, not a consumer/patient. Therefore, the system exposes global financial metrics and a system-wide ledger rather than strictly isolating data to a single patient's view.
2. **Synchronous Adjudication:** I assumed claims should be adjudicated synchronously in real-time when the `POST` request is fired. In a massive production system, this would likely be offloaded to an asynchronous message queue (e.g., Kafka/RabbitMQ) with a webhook or polling mechanism for the frontend.
3. **Currency Handling:** I assumed standard JavaScript floating-point numbers are acceptable for this prototype's financial calculations, though a production environment would require a dedicated currency library (or integer/cents storage) to prevent rounding errors.