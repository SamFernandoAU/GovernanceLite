# GL5 · Suppliers and integrations

> **Outcome:** You know which third parties, SaaS integrations, OAuth apps, extensions and AI vendors can touch your code or data, and who owns each one. Anything nobody can explain gets removed.

## Why it matters

Almost half of breaches now involve a third party (48% in the 2026 Verizon DBIR, up from 30% the year before). A forgotten integration is a standing door into your systems. In the Salesloft Drift campaign, attackers stole the OAuth tokens of a chat app many companies had connected to their CRM years earlier. Because the tokens belonged to a trusted app, MFA never came into play, and more than 700 organisations were potentially affected. Browser and IDE extensions follow the same pattern: trusted for years, then malicious after one update.

Every "Allow" button grants access that lasts until someone takes it away.

## Who's involved

| Role | Responsibility |
| --- | --- |
| Practice owner (often operations or the security champion) | Keeps the supplier register and runs the quarterly integration review |
| Whoever requests a new tool | Becomes its owner, and answers what it can access and why |
| Identity and platform admins | Restrict user consent, approve high-privilege scopes, manage the extension allow-list |
| Procurement or finance | Flags new contracts and contract end dates |

## Start this week

1. Export the OAuth apps and integrations from your identity provider, source control and CRM.
2. For each one, find an owner. Revoke anything nobody claims.
3. Restrict user consent so high-privilege scopes need admin approval.
4. Start a supplier register with your ten most important vendors, including AI providers.

## Level 1 · Baseline

- [ ] A supplier register lists every SaaS product, vendor and AI provider that processes your data or code, with an owner, data types and contract end date
- [ ] OAuth apps and integrations on your core platforms (Microsoft 365/Entra ID, Google Workspace, GitHub, CRM) are inventoried, and anything without an owner is removed
- [ ] User consent to new OAuth apps is restricted, so high-privilege scopes need admin approval

## Level 2 · Established

- [ ] A quarterly review covers OAuth grants, GitHub apps, browser extensions and IDE extensions, with extensions allow-listed on managed devices
- [ ] New suppliers are checked before onboarding: security assurance (SOC 2 or ISO report, or a questionnaire), data location, breach notification terms, and AI training and data-use terms
- [ ] Integration tokens are minimally scoped and rotated, and integration activity is logged

## Level 3 · Evidenced

- [ ] Each critical supplier's yearly review is recorded
- [ ] An offboarding checklist runs whenever a contract ends: revoke tokens, confirm data deletion, remove integrations
- [ ] Concentration risk is noted for critical suppliers: what would you do if they were breached tomorrow?

## What goes in the supplier register

| Field | Example |
| --- | --- |
| Supplier and product | CRM platform |
| Owner | `team-sales-ops` |
| What it can access | Customer contacts, deal notes; OAuth read/write to the CRM |
| Data location | Australia, or the region named in the contract |
| Assurance | SOC 2 Type II report, dated |
| Uses data for AI training? | No, per contract clause, or not applicable |
| Contract end and last review | Dates |

## How to do it on your platform

| Platform | Where the integrations are |
| --- | --- |
| Microsoft 365 / Entra ID | Enterprise applications and consented permissions. In PowerShell, `Get-MgOauth2PermissionGrant -All` lists delegated grants. |
| Google Workspace | Admin console → Security → Access and data control → API controls → Manage third-party app access |
| GitHub | Organisation settings → third-party access (OAuth apps and GitHub Apps), plus fine-grained tokens with organisation access |
| Azure DevOps | Organisation settings → policies for third-party OAuth application access, plus installed extensions |
| GitLab | Group or instance applications, plus integrations configured per project |
| AWS, Azure, Google Cloud | Cross-account roles, service principals and service accounts granted to third parties, such as monitoring and cost tools |
| CRM (Salesforce and others) | Connected apps and their OAuth usage |
| Browsers and IDEs | Extension inventory from your device management, compared with the allow-list |

For each app, ask who owns it, what it can read, and when it was last used. If nobody can answer all three, plan to revoke it, and let likely users know first.

## AI agents

AI vendors are suppliers, and MCP servers are integrations. Put both in the register. For each, record what data it receives, whether that data can be used for model training, where it's processed, and which tools or systems it can reach. A third-party MCP server you install runs with whatever access you give it, so review it like any other integration before connecting it to anything sensitive.

## Evidence this produces

- The supplier register, with review dates
- OAuth app and extension review records
- Admin consent settings
- Supplier offboarding tickets

## Metrics

| Metric | Target |
| --- | --- |
| Integrations and OAuth apps with no owner | 0 |
| Critical suppliers reviewed in the last 12 months | 100% |

## Cadence

Before onboarding · quarterly integration review · yearly supplier review · on contract end

## Common pitfalls

- **Only reviewing big vendors.** The small plug-in somebody approved years ago may be the one with full CRM access.
- **Secrets in support tickets and CRM notes.** In the Drift campaign, attackers searched stolen CRM data for more keys.
- **No exit plan.** When a contract ends, its tokens usually don't.

## Maps to

| Framework | References |
| --- | --- |
| ISO/IEC 27001:2022 | A.5.19–A.5.22 supplier relationships, agreements, ICT supply chain, monitoring (direct); A.5.23 Cloud services (partial) |
| SOC 2 (2017 TSC) | CC9.2 vendor and business partner risk (direct) |
| ASD Essential Eight | No direct equivalent. Extension allow-listing fits the intent of User application hardening, but E8 doesn't name extension controls. |
