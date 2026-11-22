# GovernanceLite

**A mini governance framework for engineering teams.** Ten practices, three levels, one 30-minute review a month. It's built for teams where AI writes a lot of the code.

> **The idea in one line:** guardrails, not gates. Each practice should produce its evidence as a side effect of doing the work, so you don't need a GRC platform or a compliance team to start.

> **A practical start, not a replacement.** GovernanceLite isn't a replacement for robust frameworks such as ISO/IEC 27001, SOC 2 or the NIST Cybersecurity Framework. It's a practical starting point for engineering teams that aren't chasing a certification, or that want good habits in place before they do.

GovernanceLite was introduced at DDD Adelaide 2026 in the talk [*The Build Passed. The Hackers Don't Care.*](https://samfernandoau.github.io/the-build-passed/). Each practice page gives you an outcome, the people involved, what to do this week, three levels, how to do it on common platforms (GitHub, Azure DevOps, GitLab, AWS, Azure, Google Cloud, Microsoft 365 and Google Workspace), guidance for AI agents, a metric, and a mapping to the standards you already know.

## Who it's for

- Product and platform teams of roughly 5–150 engineers
- Teams that use AI assistants and agents in day-to-day delivery
- Startups and SMEs that need credible security governance before they can justify a full ISMS
- MSPs and consultancies that want one consistent baseline across client teams
- Teams heading towards ISO/IEC 27001 or SOC 2 who want habits first and paperwork second

## Principles

1. **Guardrails, not gates.** Make the safe path the easy path. Prefer a check in the pull request to a review board.
2. **Evidence as a side effect.** If a practice needs a separate spreadsheet to prove it happened, redesign the practice.
3. **Owned or it doesn't exist.** Every asset, check, risk and action has an owning team and a date.
4. **Humans and agents are both actors.** AI agents get identities, permissions, logs and reviews, the same as people.
5. **Green is a signal, not proof.** Passing checks show the checks passed. Ask what the change *exposes*.
6. **Small, frequent, boring.** Little and often beats big and rare, whether it's upgrades, access reviews or plan read-throughs.

## The ten practices

| # | Practice | Outcome |
| --- | --- | --- |
| GL1 | [Ownership](practices/01-ownership.md) | Everything has an owning team, or a decommission date |
| GL2 | [Identity and access](practices/02-identity-and-access.md) | Every human and agent signs in as itself, with access that ends when the need ends |
| GL3 | [AI usage rules](practices/03-ai-usage-rules.md) | Approved tools, clear data rules, and a human accountable for what ships |
| GL4 | [Secure design](practices/04-secure-design.md) | Significant changes get a short threat model before code is written |
| GL5 | [Guardrailed pipeline](practices/05-guardrailed-pipeline.md) | Every change reaches production through a protected path with fast, risk-ranked checks |
| GL6 | [Data protection](practices/06-data-protection.md) | You know what sensitive data you hold, keep only what you need, and keep it out of test |
| GL7 | [Suppliers and integrations](practices/07-suppliers-and-integrations.md) | You know every third party, OAuth app and extension that can touch your code or data |
| GL8 | [Logging and evidence](practices/08-logging-and-evidence.md) | You can answer "who accessed what, when, from where?" before you need to |
| GL9 | [Incident readiness](practices/09-incident-readiness.md) | A one-page plan, written on a quiet day, that works at 2 AM |
| GL10 | [Monthly review](practices/10-monthly-review.md) | 30 minutes a month that keeps the other nine alive, and the minutes become your evidence |

## Three levels

Each practice has the same three levels. See [maturity levels](maturity-levels.md) for scoring.

| Level | Name | What it means |
| --- | --- | --- |
| 1 | **Baseline** | The minimum that stops the common incidents. Most teams can get there in about a month. |
| 2 | **Established** | Running as a habit, automated where it can be, and checked on a schedule |
| 3 | **Evidenced** | Records an auditor or a customer's security questionnaire could rely on |

## How to adopt it

1. **Read** the ten practice pages (about 30 minutes in total).
2. **Score** your team with the [self-check](../#/self-check) or by ticking the Level 1 boxes in each page.
3. **Follow** the [30-day adoption plan](adopt-in-30-days.md) to reach Level 1 everywhere.
4. **Run** the [monthly review](practices/10-monthly-review.md) and raise one practice per quarter.

## Roles

GovernanceLite needs three roles, not a department. One person can hold more than one.

| Role | Responsibility |
| --- | --- |
| **Sponsor** (CTO, head of engineering or founder) | Sets the target level, removes blockers, and sees the quarterly one-page summary |
| **Practice owner** (one per practice, usually a senior engineer) | Keeps their practice at its target level and reports its metric each month |
| **Security champion** | Runs the monthly review, keeps the risk register, and helps teams with the checks |

## What it isn't

- **Not a replacement for robust frameworks.** ISO/IEC 27001, SOC 2 and the NIST Cybersecurity Framework cover far more ground. GovernanceLite gets an engineering team started; adopt a full framework when you need certification or broader assurance.
- **Not a certification.** It produces evidence for a subset of ISO/IEC 27001 and SOC 2 controls, but it doesn't cover the management-system requirements: you still need scope, a risk method, a Statement of Applicability or system description, and an audit. See [mappings](mappings.md).
- **Not a replacement for legal advice.** Regulatory timeframes are listed to help you plan. Check your obligations with your legal team.
- **Not a tool list.** Tools are suggested, never required. Use what fits your stack.

## Also in this framework

- [Adopt in 30 days](adopt-in-30-days.md)
- [Maturity levels and scoring](maturity-levels.md)
- [Metrics: one per practice](metrics.md)
- [Mappings: ISO/IEC 27001, SOC 2, ASD Essential Eight, OWASP](mappings.md)
- [FAQ](faq.md)
