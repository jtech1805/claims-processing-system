
**Architectural Trade-off**: Functional vs. OOP Rules Engine
For the core Adjudication Engine, I debated between a strict Class-Based Strategy Pattern (interfaces, dependency injection, separate rule classes) and a Functional Pipeline.

I chose the Functional Pipeline (implemented in RulesEngine.ts).

Why: building an OOP hierarchy would introduce unnecessary enterprise bloat. The functional approach still perfectly satisfies the Open/Closed Principle—new rules can be added to the pipeline array without modifying the loop—and pure functions provide the highest velocity for writing robust unit tests. If this engine scaled to require external IO (e.g., calling a 3rd-party fraud API mid-rule), I would refactor to an injected Class-Based architecture.

 **Lack of API Pagination**
   The `GET /api/claims` route currently fetches the entire collection of claims to feed the frontend data table. For a prototype, this works. In production, this would cause massive performance bottlenecks. I would immediately implement cursor-based pagination (or limit/offset) on the backend and wire it to an infinite-scroll or paginated table on the UI.

**Frontend Development Strategy**
Transparency Note: In the interest of time, and to ensure the core backend rules engine received the architectural focus it required, I utilized AI (Claude) to generate the initial React/Tailwind visual scaffolding and for create new claim i used mongo id to create claim which is not and ideal way ta add policy id also in that component fetches policy which was not completed at my end pending bcoz of time constraints 

Integration & Architecture:
While the AI generated the CSS and visual layout, I personally handled the environment setup and API integration. This included configuring the Vite/Tailwind v4 build pipeline, connecting the Axios client to the backend routes, and deliberately configuring a permissive wildcard (*) CORS policy on the Express server to ensure frictionless cross-origin requests during local prototype testing. This hybrid approach allowed me to ship a complete, working product within the deadline.