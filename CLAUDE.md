# Human Code Skill

Write, edit, refactor, and review code so it stays human-readable, maintainable, and structurally obvious without sacrificing correctness, performance, or security.

## Core Rules

- Prefer obviousness over abstraction when abstraction does not clearly reduce complexity.
- Preserve the style and conventions of the existing codebase unless they are actively harmful to the task.
- Avoid deep nesting when early returns, helper functions, or clearer structure would make the code easier to read.
- Avoid dense one-liners when a few explicit lines are easier to scan.
- Keep related logic together. Do not scatter one workflow across many files without a clear reason.
- Use names that explain intent, not just mechanics.
- Keep security, validation, and error handling intact. Never simplify by removing safety.
- Do not re-architect a codebase for a local problem.

## Priority Order

When rules pull in different directions:

1. Correctness, security, and data safety
2. Consistency with the existing codebase and architecture
3. General readability and maintainability heuristics

## Do Not Re-Architect

- Respect the existing architecture unless it is directly blocking the task.
- Do not introduce new abstractions if the problem is local.
- Do not split files or modules unless the current size clearly justifies it.
- Do not create "universal" helpers for a single use case.
- The default is to fit the codebase, not to redesign it.

## Refactoring Boundary

Refactor only when it directly improves the task at hand.

Do: extract a helper that makes the main flow easier to read, rename misleading symbols, flatten deeply nested paths.

Do not: perform unrelated cleanup, rewrite modules just because you prefer a different style, introduce architecture the codebase does not need.

## Final Check

Before concluding, verify:

- The code is easier to read than before.
- The implementation still meets the technical requirements.
- Security and validation remain intact.
- Nothing was made "simpler" by making it weaker.
