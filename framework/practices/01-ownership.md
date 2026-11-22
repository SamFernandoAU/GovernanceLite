# GL1 · Ownership

> **Outcome:** Every service, repository, data store, cloud account, integration and AI agent has a named owning team. Anything without an owner has a decommission date.

## Why it matters

Ownership is the control that makes every other control work. A patch needs someone to apply it, an alert needs someone to read it, and an access review needs someone who can say "that isn't ours". When an asset has no owner, nothing else in this framework happens to it.

Things you stop using don't stop existing. Dormant endpoints, abandoned buckets, old staging environments and integrations from a project that finished two years ago keep answering requests long after everyone has forgotten them. They're also the assets least likely to be patched, logged or included in a pen-test scope. If it still answers requests, it isn't retired.

## Who's involved

| Role | Responsibility |
| --- | --- |
| Practice owner (usually the platform or engineering lead) | Runs the asset register, sets the tagging policy, chases unowned assets |
| Every delivery team | Owns its services, repos, data stores and agents, and keeps their entries current |
| Security champion | Reconciles the register against external sources each quarter |
| Sponsor | Agrees decommission dates when nobody claims an asset |

## Start this week

1. Add a `CODEOWNERS` file to every production repository, naming a **team**, not a person.
2. Export your public DNS records and search certificate transparency logs for your domains. Put every internet-facing name in one list.
3. Tag every cloud account, subscription or project with an owner and a billing contact.
4. List every bot, automation and AI agent that can act in your systems, and who answers for each.
5. For anything nobody claims within two weeks, set a decommission date.

## Level 1 · Baseline

- [ ] Every production service and repository has an owning **team** (not a person), recorded in the repo (`CODEOWNERS`) or a service catalogue
- [ ] Every cloud account, subscription or project has an owner tag and a billing contact
- [ ] Every internet-facing endpoint (domain, gateway route, public bucket, public IP) is in one asset register with an owner
- [ ] Every AI agent, bot and automation that can act in your systems has an owner

## Level 2 · Established

- [ ] Owner tags are required by policy: new resources or public routes without an owner fail the pipeline or the cloud policy
- [ ] Each month, owners are checked against the directory, and assets owned by teams that no longer exist go to the monthly review
- [ ] An asset with no owner after two weeks gets a decommission date and is switched off on that date
- [ ] Each quarter, the register is reconciled against external sources: certificate transparency logs, DNS zones, cloud inventory and the cloud bill
- [ ] Everything internet-facing is scanned continuously from the outside, including things believed to be switched off

## Level 3 · Evidenced

- [ ] A dated export of the asset register is kept each month
- [ ] Decommissioning has a definition of done (access removed, data deleted, DNS, CDN and IAM references removed), and each one is recorded in its ticket
- [ ] Ownership coverage is reported as a metric in the monthly review
- [ ] Pen-test and certification scopes are checked against the asset register, so nothing internet-facing sits outside them

## What goes in the asset register

Keep it small enough that people actually maintain it. A spreadsheet or a service catalogue both work.

| Field | Example |
| --- | --- |
| Asset | `api.example.com/partners/v2` |
| Type | Gateway route, repo, bucket, database, SaaS app, agent |
| Owning team | `team-payments` |
| Environment | Production, staging, test |
| Internet-facing | Yes / no |
| Data held | Customer personal data, internal only, none |
| Status and date | Live, or decommission date |

## How to do it on your platform

| Platform | What to use |
| --- | --- |
| GitHub | `CODEOWNERS` with required code-owner review in branch rules; organisation custom properties for an owner field on every repo |
| Azure DevOps | Branch policies with automatically included reviewers by path; a team per area path |
| GitLab | `CODEOWNERS` with code-owner approval rules |
| AWS | Tag policies in AWS Organizations, and the AWS Config `required-tags` rule |
| Azure | Azure Policy's built-in "Require a tag on resources" (or on resource groups) |
| Google Cloud | Labels or tags on projects and resources, with Cloud Asset Inventory to find what's missing |
| Service catalogue | Backstage or similar, with the owner field required |

## How to find assets nobody owns

Your CMDB is one source. These are the others:

- **Certificate transparency logs**: `https://crt.sh/?q=%25.example.com` lists every public certificate issued for your domains
- **DNS zones**: every record, including forgotten subdomains like `staging2` and `test-old`
- **Cloud inventory**: every account, subscription, project and region
- **The cloud bill**: if you're paying for it, it exists
- **External scanning**: see yourself the way attackers do
- **Gateway and ingress routes**: what's actually published
- **Procurement**: expired contracts often mean live services nobody owns

## AI agents

Agents are assets too. Each one needs an owning team, a stated purpose, a list of the systems and tools it can reach, and a review date. An agent nobody owns is an identity nobody watches. Record agents in the same register as everything else, and treat an unowned agent like any other unowned asset: it gets a decommission date.

## Evidence this produces

- `CODEOWNERS` files and service catalogue entries
- Policy results showing owner tags are enforced
- Dated asset register exports
- Decommission tickets with completed checklists

## Metric

| Metric | Target |
| --- | --- |
| Ownership coverage: assets with a current owning team ÷ all assets | 100% of internet-facing assets, 95%+ overall |

## Cadence

On creation (enforced by policy) · monthly owner check · quarterly reconciliation

## Common pitfalls

- **Naming a person as the owner.** People leave, teams last longer. Use team names and check them against the directory.
- **Treating the CMDB as the only source.** Certificate logs, DNS and the cloud bill show what really exists.
- **Calling a migration finished too early.** A migration isn't finished until the old bucket, endpoint or DNS name is deleted.
- **Letting scope hide assets.** Pen tests and certifications cover a defined scope. Anything internet-facing outside that scope still needs an owner and still gets attacked.

## Maps to

| Framework | References |
| --- | --- |
| ISO/IEC 27001:2022 | A.5.9 Inventory of information and other associated assets (direct); A.5.2 Information security roles and responsibilities (partial) |
| SOC 2 (2017 TSC) | CC6.1, point of focus "Identifies and manages the inventory of information assets" (direct); CC1.3 structures and responsibilities (partial) |
| ASD Essential Eight | Indirect: the patching strategies require automated asset discovery, which this register feeds. Not a substitute for any strategy. |
