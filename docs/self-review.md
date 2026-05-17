
Architectural Trade-off: Functional vs. OOP Rules Engine
For the core Adjudication Engine, I debated between a strict Class-Based Strategy Pattern (interfaces, dependency injection, separate rule classes) and a Functional Pipeline.

I chose the Functional Pipeline (implemented in RulesEngine.ts).

Why: building an OOP hierarchy would introduce unnecessary enterprise bloat. The functional approach still perfectly satisfies the Open/Closed Principle—new rules can be added to the pipeline array without modifying the loop—and pure functions provide the highest velocity for writing robust unit tests. If this engine scaled to require external IO (e.g., calling a 3rd-party fraud API mid-rule), I would refactor to an injected Class-Based architecture.
