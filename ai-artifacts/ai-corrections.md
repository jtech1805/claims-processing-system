# AI Corrections

## Project Initialization
AI-generated setup initially missed `.gitignore`.

Added `.gitignore` to avoid committing:
- node_modules
- .env
- dist
- coverage

## Missing Incident Date

Initial AI-generated claim model omitted `incidentDate`.

This field was later added because:
- policy period validation depends on it
- filing window checks require incident timing
- adjudication workflow references incident validation