# GL3 · AI usage rules

> **Outcome:** Everyone knows which AI tools, models and MCP servers are approved, what data may go into them, and what agents are allowed to do. A human is accountable for everything that ships.

## Why it matters

Treat a coding agent like a very fast junior developer. It's productive and confident, but it doesn't always know better. In GitGuardian's 2026 secrets report, public commits co-authored by Claude Code leaked secrets at about twice the GitHub-wide baseline (3.2% against 1.5%), and MCP configuration files exposed more than 24,000 unique secrets. Assistants also regularly suggest packages that don't exist, which attackers then register (slopsquatting). Malware has also disguised itself as AI tooling.

None of this is a reason to stop using AI. It's a reason to give AI the same guardrails you'd give a new starter: the same checks, limited access, and a human review before anything ships. Clear rules also make adoption faster, because people stop guessing what's allowed.

## Who's involved

| Role | Responsibility |
| --- | --- |
| Practice owner (engineering lead) | Writes and publishes the AI usage rule, runs the approved list |
| Sponsor | Approves the data rule and which tools may handle which data |
| Every engineer | Follows the rule, requests new tools instead of installing them quietly, and owns what they merge |
| Security champion | Checks agent identities, MCP configuration and new tool requests |

## Start this week

1. Write a one-page AI usage rule (see the template below) and link it from the repository template.
2. List the AI tools people already use. Approve the good ones now, so nobody needs a workaround.
3. Add AI, agent and MCP configuration files to secret scanning.
4. Confirm branch protection stops agents from merging to protected branches on their own ([GL4](04-guardrailed-pipeline.md)).

## Level 1 · Baseline

- [ ] A one-page AI usage rule is published and linked from the engineering handbook and the repository template
- [ ] There's an approved list of AI assistants, models, MCP servers and IDE extensions, and anything else needs a request
- [ ] A data rule: no customer personal data, production secrets or credentials in prompts, context files or agent memory unless the tool is approved for that data
- [ ] AI-generated code goes through the same pipeline checks, and a human reviews and merges it ([GL4](04-guardrailed-pipeline.md))

## Level 2 · Established

- [ ] Agents have their own scoped identities ([GL2](02-identity-and-access.md)) and can't merge to protected branches or deploy to production unattended
- [ ] Packages an AI suggests are checked before install: does it exist, is it established, does it have a real repository?
- [ ] MCP and agent configuration files are scanned for secrets, and keys are referenced from the secrets manager
- [ ] Agent actions that change things (tool calls, commits, deployments, data changes) are logged under the agent's identity ([GL6](06-logging-and-evidence.md))

## Level 3 · Evidenced

- [ ] AI vendors are in the supplier register with data-use and model-training terms reviewed ([GL5](05-suppliers-and-integrations.md))
- [ ] The approved list is reviewed every quarter, and exceptions are recorded with an owner and an expiry
- [ ] If AI is central to your product or delivery, you've assessed yourself against ISO/IEC 42001 (AI management systems)

## A one-page AI usage rule

Print it or copy it as Markdown, fill in the highlighted fields, and keep it to one page.

<!-- doc:start -->

### AI Usage Rule

**[Organisation or team name]**

| Owner | Last reviewed | Next review |
| --- | --- | --- |
| [name] | [date] | [date + 3 months] |

#### 1. Approved tools

Use the tools on the approved list: [link]. To add one, ask in [channel]. We aim to answer within a week.

#### 2. Data

Never put customer personal data, production secrets or credentials into a prompt, context file or agent memory, unless the tool is approved for that data.

#### 3. Accountability

You own what you merge, whoever or whatever wrote it. AI-written code gets the same review and checks as any other code.

#### 4. Agents

Agents use their own identities, never yours. They can open pull requests. They can't merge to protected branches or deploy to production unattended.

#### 5. Packages

Before installing a package an assistant suggests, check that it exists, is established and has a real repository.

#### 6. MCP servers and extensions

Only from the approved list. Keys come from the secrets manager, never pasted into configuration.

#### 7. Report it

If something goes wrong, such as a secret in a prompt or an agent doing something unexpected, tell [channel] straight away. No blame.

<!-- doc:end -->

## How to do it on your platform

| Platform | What to use |
| --- | --- |
| GitHub | Copilot policies at organisation or enterprise level, including content exclusions and whether MCP servers are allowed; rulesets so agent pull requests still need a human approval |
| Azure DevOps | Branch policies requiring a human reviewer; a separate service identity for any agent that opens pull requests |
| GitLab | GitLab Duo settings at group level; protected branches with approval rules |
| Coding agents and IDEs | Managed or organisation-wide settings where the tool offers them (allowed models, MCP servers, commands the agent may run); an extension allow-list through device management |
| Microsoft 365 / Entra ID | Admin consent for AI apps; Purview sensitivity labels to control what Microsoft 365 Copilot can surface |
| Google Workspace | Turn Gemini features on or off by organisational unit in the Admin console |
| Cloud AI services (AWS, Azure, Google Cloud) | Use them inside your own accounts, with private networking and logging, so prompts and outputs stay under your controls |

## Check a package before you install it

```sh
npm view some-package time.created repository.url maintainers
```

A package created last week, with no repository and a single maintainer, suggested by an assistant for a common task, is a red flag.

## AI agents

Agents are where the rule gets specific. For each agent, write down what it's for, which tools and systems it can reach, whether it can change anything, and who owns it. Start agents read-only and add write access one tool at a time. Anything that changes production, data or permissions needs a human to approve it. Log every action under the agent's own identity, so you can tell what the agent did from what a person did.

## Evidence this produces

- The published AI usage rule and the approved tool list, with its review dates
- PR history showing agent-authored changes were reviewed and merged by people
- Agent identities and their permissions
- Supplier register entries for AI vendors

## Metrics

| Metric | Target |
| --- | --- |
| Agent-authored PRs merged by a human | 100% |
| Secrets found in AI, agent or MCP configuration | 0 open |

## Cadence

Published once and linked everywhere · approved list reviewed quarterly · exceptions expire

## Common pitfalls

- **Blocking AI outright.** People often find workarounds, which means less visibility. Approving good tools quickly keeps usage where you can see it.
- **Agents with production credentials.** Least privilege applies to agents too, perhaps more so.
- **Trusting extension marketplaces.** "Verified" and "featured" extensions have turned malicious through a single update. Allow-list them.
- **Reviewing AI code more lightly.** Large, confident diffs deserve more review, not less. Ask for smaller pull requests.

## Maps to

| Framework | References |
| --- | --- |
| ISO/IEC 27001:2022 | A.5.10 Acceptable use (partial); A.5.23 Cloud services, for approved AI tools (partial); A.8.28 Secure coding (partial) |
| SOC 2 (2017 TSC) | CC2.2 communicating responsibilities; CC5.3 policies and procedures (partial) |
| ISO/IEC 42001 | The AI management system standard, for teams that need to go further |
