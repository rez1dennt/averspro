# Human Code Skill

Prefer code that another engineer can understand quickly without reverse-engineering hidden intent.
The goal: obvious control flow, readable naming, maintainable structure, safe and correct behavior, no unnecessary cleverness.

## Core Rules

- Prefer obviousness over abstraction when abstraction does not clearly reduce complexity.
- Preserve the style and conventions of the existing codebase unless they are actively harmful to the task.
- Avoid deep nesting when early returns, helper functions, or clearer structure would make the code easier to read.
- Avoid dense one-liners when a few explicit lines are easier to scan.
- Keep related logic together. Do not scatter one workflow across many files without a clear reason.
- Use names that explain intent, not just mechanics.
- Keep security, validation, and error handling intact. Never simplify by removing safety.
- Do not "satisfice" a task. Deliver complete, production-acceptable work unless explicitly asked for a rough prototype.
- Do not re-architect a codebase for a local problem.

## Priority Order

1. correctness, security, and data safety
2. consistency with the existing codebase and architecture
3. general readability and maintainability heuristics

## General Heuristics

- Prefer direct branching over clever boolean compression.
- Prefer small helpers with clear names over inline complexity.
- Prefer explicit data shapes over "magic" transformations.
- Prefer predictable interfaces over overly generic utilities.
- Prefer a boring implementation that is easy to maintain over a smart implementation that is hard to modify.

## Do Not Re-Architect

- Respect the existing architecture unless it is directly blocking the task.
- Do not introduce new abstractions if the problem is local.
- Do not split files, components, or modules unless the current size or complexity clearly justifies it.
- Do not create "universal" helpers for a single use case.
- Do not rewrite established patterns just because you would structure them differently in a new project.

Good signs: a reviewer can explain the code after one pass. The main path is visually obvious. Variable and function names carry meaning. The diff is easy to scan.

Bad signs: heavy indirection for simple work. Names like `data`, `result`, `handle`, `process` where intent is unclear. Refactors that reduce lines but increase mental load.

## Refactoring Boundary

Do: extract a helper that makes the main flow easier to read, rename misleading symbols, flatten a deeply nested path.
Do not: perform unrelated cleanup, rewrite modules just because you prefer a different style, introduce architecture the codebase does not need.

## Final Check

Before concluding, verify:
- the code is easier to read than before
- the implementation still meets the technical requirements
- security and validation remain intact
- nothing was made "simpler" by making it weaker
- readability did not get worse relative to the original code
