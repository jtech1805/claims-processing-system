+----------------------+
| 1. Policy Setup      |
|----------------------|
| - Coverage Rules     |
| - Exclusions          |
| - Deductible          |
| - Annual Limit        |
+----------------------+
           |
           v
+----------------------+
| 2. Claim Submission  |
|----------------------|
| - Claim Details      |
| - Claim Line Items   |
| - Documents          |
+----------------------+
           |
           v
+----------------------+
| 3. Validation Checks |
|----------------------|
| - Policy Exists      |
| - Policy Active      |
| - Required Fields    |
| - Duplicate Check    |
+----------------------+
     |            |
     | Invalid    | Valid
     v            v
+-------------+   +----------------------+
| REJECTED    |   | 4. Line-Item         |
|             |   |    Adjudication      |
+-------------+   +----------------------+
                             |
                             v
              +-----------------------------+
              | Per Line Item Processing    |
              |-----------------------------|
              | checkCoverage()             |
              | checkExclusion()            |
              | applyDeductible()           |
              | checkAnnualLimit()          |
              | calculateApprovedAmount()   |
              +-----------------------------+
                             |
                             v
              +-----------------------------+
              | Item-Level Decisions        |
              |-----------------------------|
              | PENDING                    |
              | PARTIAL_APPROVED            |
              | REJECTED                    |
              | PENDING_DOCUMENTS           |
              +-----------------------------+
                             |
                             v
+------------------------------------------------+
| 5. Aggregate Claim Decision                    |
|------------------------------------------------|
| All Items Approved      -> APPROVED            |
| Mixed Results           -> PARTIAL_APPROVED    |
| All Items Rejected      -> REJECTED            |
| Missing Docs/Review     -> PENDING_DOCUMENTS   |
+------------------------------------------------+
                             |
                             v
+----------------------+
| 6. Final Claim Result|
|----------------------|
| - Final Status       |
| - Approved Amount    |
| - Denial Reasons     |
| - Payment Amount     |
+----------------------+