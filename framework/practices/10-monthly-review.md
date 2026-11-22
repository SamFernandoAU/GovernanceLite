# GL10 · Monthly review

> **Outcome:** Once a month, a 30-minute review looks at risks, a few metrics, and actions with owners and dates. This loop keeps the other nine practices alive, and its minutes become your governance evidence.

## Why it matters

Controls decay quietly. Owners move teams, new suppliers get connected, scanners pile up findings, and exceptions outlive their reasons. A certificate or an audit shows how things looked on the days someone checked; it doesn't keep them that way. What keeps a team secure is a short, regular loop that notices new risks, checks a few numbers, and makes sure actions get done.

Thirty minutes a month is enough when the other practices produce their evidence automatically. Certification is a strong foundation, and this loop builds on it: audits confirm controls exist, and regular review keeps them working.

## Who's involved

| Role | Responsibility |
| --- | --- |
| Security champion | Runs the review, keeps the risk register and minutes |
| Engineering lead | Attends every review, makes or escalates decisions |
| Practice owners | Bring their metric and any blocked actions |
| Sponsor | Receives the quarterly one-page summary and decides on escalations |

## Start this week

1. Book a recurring 30-minute meeting for the same week each month.
2. Create a minutes page or issue template with the agenda below.
3. Start a risk register with your top ten risks, each with an owner and a review date.
4. Run the [self-check](../../#/self-check) and bring the result to the first review.

## Level 1 · Baseline

- [ ] A recurring 30-minute monthly review is in the calendar, with an engineering lead and the security champion
- [ ] It follows a standard agenda: metrics, top risks, what's new (services, suppliers, AI tools), overdue actions, decisions
- [ ] A small risk register (10–20 lines) records an owner, treatment and review date for each risk
- [ ] Minutes and actions are recorded in the repo or wiki

## Level 2 · Established

- [ ] One metric per practice is tracked over time (see [metrics](../metrics.md))
- [ ] Core control health (MFA coverage, patch age, backup success) is on a dashboard someone looks at weekly
- [ ] Risk acceptances record a reason, an owner and an expiry, and expired ones come back to the review
- [ ] Each quarter, the team self-assesses against the GovernanceLite levels and picks one practice to raise

## Level 3 · Evidenced

- [ ] Twelve months of minutes, risk register history and self-assessments are kept, forming the core of management review evidence
- [ ] The sponsor receives a one-page summary each quarter: levels, metrics trend, top risks, decisions needed

## The 30-minute agenda

| Minutes | Item |
| --- | --- |
| 5 | Metrics: one per practice, and what changed since last month |
| 10 | Top risks: new, changed, or past their review date |
| 5 | What's new: services, suppliers, integrations, AI tools, public endpoints |
| 5 | Actions: overdue items, and anything blocked |
| 5 | Decisions: accept, treat or escalate, each with an owner and a date |

## What goes in the risk register

| Field | Example |
| --- | --- |
| Risk | Leaked cloud key used to read customer data |
| Owner | `team-platform` |
| Likelihood and impact | Medium / high |
| Treatment | Move remaining pipelines to OIDC ([GL2](02-identity-and-access.md)) |
| Status | Treating, accepted (with expiry), or closed |
| Review date | Date |

## How to do it on your platform

| Platform | What to use |
| --- | --- |
| GitHub | An issue template for the minutes; GitHub Projects for actions with owners and due dates; the security overview for findings trends |
| Azure DevOps | A wiki page per review; Azure Boards work items for actions |
| GitLab | An issue template and milestones for actions; the security dashboard for trends |
| AWS, Azure, Google Cloud | Security Hub, Defender for Cloud secure score, or Security Command Center for the posture number |
| Microsoft 365 / Entra ID, Google Workspace | MFA and authentication method reports for the identity metric |

## AI agents

An agent can prepare the review: pull the metrics, list new suppliers and public endpoints, flag actions past their due date and draft the minutes. People make the decisions, accept the risks and own the actions. Add agents to the "what's new" item, so new agents and new permissions are seen by the review like any other change.

## Evidence this produces

- Monthly minutes with actions, owners and dates
- Risk register history
- Quarterly self-assessments and sponsor summaries

## Metrics

| Metric | Target |
| --- | --- |
| Reviews held in the last 12 months | 12 |
| Actions closed by their due date | 80%+ |
| Risk acceptances past their expiry | 0 |

## Cadence

Monthly review · quarterly self-assessment and sponsor summary · yearly look at target levels

## Common pitfalls

- **Letting it grow to two hours.** Keep it to 30 minutes, and send deep dives to their own meetings.
- **Metrics nobody acts on.** Each metric needs an owner and a target, or drop it.
- **Skipping it when things are quiet.** Quiet months are when the review is cheap and useful.
- **Accepting risks forever.** Every acceptance needs an expiry, so it comes back.

## Maps to

| Framework | References |
| --- | --- |
| ISO/IEC 27001:2022 | Clauses 6.1 risk actions, 9.1 monitoring and measurement, 10 improvement (partial); 9.3 management review (partial: ISO lists required inputs) |
| SOC 2 (2017 TSC) | CC3 risk assessment; CC4 monitoring activities (partial) |
