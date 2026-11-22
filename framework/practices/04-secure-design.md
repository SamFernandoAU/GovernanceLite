# GL4 · Secure design

> **Outcome:** Security is considered before code is written. Every significant change gets a short threat model, and security requirements become testable acceptance criteria.

## Why it matters

Some flaws can't be found by scanning code, because the code does exactly what it was designed to do. A missing permission check, an endpoint that returns more data than the caller needs, or a workflow that can be replayed are design decisions, not typos. Broken Access Control is number one in the OWASP Top 10:2025, and Insecure Design has its own category in the list.

Design problems are cheapest to fix on a whiteboard and most expensive to fix in production. A 30-minute conversation before the first pull request is usually enough to catch the ones that matter, as long as it happens for the right changes and someone writes down what was decided.

## Who's involved

| Role | Responsibility |
| --- | --- |
| Practice owner (usually a senior engineer or architect) | Keeps the trigger list and the threat-model template, and makes sure reviews happen |
| Every delivery team | Writes a short design note and threat model for triggered changes, and turns the findings into backlog items |
| Security champion | Joins reviews of high-risk designs and checks that findings get done |
| Product owner | Accepts security requirements and abuse cases as part of "done" |

## Start this week

1. Agree the trigger list below and add it to your pull request or design template.
2. Pick one change that's in progress and run a 30-minute threat model on it with the team.
3. Write down the authorisation rules for one sensitive API: who can call each endpoint, and on whose data.
4. Add one automated test that proves an unauthorised caller is refused.

## Level 1 · Baseline

- [ ] A design-review trigger list exists, and any change that matches it gets a short written design note
- [ ] Triggered changes get a 30-minute threat model that answers four questions: what are we working on, what can go wrong, what are we going to do about it, and did we do a good job?
- [ ] Authorisation rules are written down for each sensitive endpoint, and automated tests check that access is denied by default

## Level 2 · Established

- [ ] Service templates provide secure defaults: authentication middleware, input validation, security headers, rate limiting and structured logging
- [ ] Abuse cases are written as acceptance criteria next to the user stories
- [ ] Threat-model findings are tracked as backlog items with owners and dates
- [ ] The security champion reviews designs that touch authentication, payments, personal data or AI agents

## Level 3 · Evidenced

- [ ] Design notes, threat models and architecture decision records (ADRs) are kept in the repository next to the code
- [ ] The most important systems get a yearly architecture review that looks at how an attacker would move between components

## What triggers a design review

| Trigger | Why it matters |
| --- | --- |
| A new public endpoint, route or webhook | It's a new way in |
| A new data store, or a new type of data in an existing one | Especially personal, financial or health data, or secrets ([GL6](06-data-protection.md)) |
| A change to authentication, sessions or permissions | Small changes here have wide effects |
| A new third-party service, integration or OAuth app | Someone else's code gets access to yours ([GL7](07-suppliers-and-integrations.md)) |
| A new AI agent, model or MCP server, or new tools for an existing one | Agents act on text they read, including text an attacker wrote |
| Money, deletion or anything irreversible | Mistakes can't be rolled back |

## A design note on one page

Print it or copy it as Markdown, fill in the highlighted fields, and keep it to one page.

<!-- doc:start -->

### Design note

**[Feature or change]**

| Author | Date | Reviewed by |
| --- | --- | --- |
| [name] | [date] | [name] |

#### 1. What we're building

One paragraph and a simple diagram showing data flows and trust boundaries: [description].

#### 2. Data

What data it handles, how sensitive it is, and where it's stored: [data].

#### 3. Who can do what

The roles, and what each one is allowed to read or change: [roles].

#### 4. What can go wrong

The top five threats: [threats]. STRIDE is a useful prompt: spoofing, tampering, repudiation, information disclosure, denial of service and elevation of privilege.

#### 5. What we'll do about it

A mitigation for each threat, or an accepted risk with an owner: [mitigations].

#### 6. How we'll know

The tests, alerts or logs that prove the mitigations work: [checks].

<!-- doc:end -->

## How to do it on your platform

| Platform | What to use |
| --- | --- |
| GitHub | A pull request template with the trigger list as checkboxes; `CODEOWNERS` so changes to sensitive paths (auth, payments) need the security champion's review; ADRs in a `docs/adr` folder |
| Azure DevOps | A work item template with the trigger list; branch policies that add required reviewers for sensitive paths; the wiki for design notes |
| GitLab | Merge request templates with the trigger list; approval rules for sensitive paths |
| AWS, Azure, Google Cloud | The security pillar of each provider's Well-Architected Framework, as a checklist for cloud designs |
| Threat modelling tools | A whiteboard is enough. OWASP Threat Dragon and the Microsoft Threat Modeling Tool are free if you want diagrams; OWASP Cornucopia cards help teams practise |

## AI agents

Treat an agent as a component with its own trust boundary. Every threat model for an agent should ask: what tools and data can it reach, what untrusted text will it read (web pages, tickets, emails, documents), what could someone make it do by writing that text (prompt injection), and which actions need a human to approve them. Give agents the narrowest tools that do the job, and design so that a misled agent can't cause irreversible harm on its own. Agents can also help: ask one to draft the threat model, then have the team review it.

## Evidence this produces

- Design notes and threat models, kept in the repository
- Pull requests with the trigger checklist completed
- Authorisation tests in the test suite
- Backlog items created from threat-model findings

## Metric

| Metric | Target |
| --- | --- |
| Triggered changes with a threat model before release | 100% of high-risk changes |

## Cadence

Every triggered change · findings reviewed in the monthly review · yearly architecture review for the most important systems

## Common pitfalls

- **Threat models that take weeks.** A short, regular conversation beats a long document nobody updates.
- **Reviewing too late.** A design review after the code is written turns into a code review that nobody wants to act on.
- **Findings that live in the document.** If a mitigation isn't a backlog item with an owner, it usually doesn't happen.
- **Checking permissions in the user interface only.** Every API must enforce access itself.

## Maps to

| Framework | References |
| --- | --- |
| ISO/IEC 27001:2022 | A.8.26 Application security requirements; A.8.27 Secure system architecture and engineering principles (direct); A.5.8 Information security in project management (partial) |
| SOC 2 (2017 TSC) | CC8.1 change management, for design and approval of changes (partial) |
| NIST SSDF (SP 800-218) | PW.1 Design software to meet security requirements and mitigate security risks |
| OWASP Top 10:2025 | A01 Broken Access Control; A06 Insecure Design (partial) |
