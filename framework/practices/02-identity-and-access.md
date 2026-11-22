# GL2 · Identity and access

> **Outcome:** Every human and non-human actor signs in as itself. People use phishing-resistant MFA, workloads and agents use short-lived credentials, and access ends when the need ends.

## Why it matters

Most incidents still start with a login: a saved browser password, an infostealer, or a remote-access service that accepted a username and password with no MFA. In 2024, attackers logged into around 165 organisations' Snowflake accounts with passwords stolen by infostealers, some from 2020. The platform held; the accounts had no MFA and no network allow-lists. Cloud and SaaS providers secure their platforms. Who can log in to your tenant is your half of the shared responsibility model.

Access also outlives its purpose. Contractor accounts survive the contract, guest accounts survive the project, and personal access tokens survive the person who made them. Long-lived secrets are the same problem in another form: most leaked secrets are never rotated, and internal repositories leak more of them than public ones. The best secret is one that doesn't exist, so prefer federated, short-lived credentials over stored keys wherever you can.

## Who's involved

| Role | Responsibility |
| --- | --- |
| Practice owner (identity or platform lead) | Runs SSO, MFA and conditional access policy, owns the non-human identity inventory |
| People and HR, or whoever manages contracts | Sends joiner, mover and leaver events with dates |
| Every delivery team | Moves pipelines to OIDC, keeps secrets in the secrets manager, owns their service principals and tokens |
| Security champion | Runs the quarterly access review and the leaked-secret runbook |

## Start this week

1. Turn on MFA enforcement at the tenant or organisation level for your identity provider, source control and every cloud console.
2. Turn on secret scanning with push protection for every repository.
3. List every admin account and remove shared logins. Document and test your break-glass accounts.
4. Pick one pipeline that uses a stored cloud key and move it to OIDC.
5. Export accounts with no sign-in for 90 days and disable the ones nobody claims.

## Level 1 · Baseline

- [ ] Single sign-on for every tool that supports it, with MFA enforced at the tenant level for every cloud and SaaS console, so no account can opt out
- [ ] No shared accounts: every admin has an individual account, and break-glass accounts are documented, monitored and tested
- [ ] Leavers and contractors lose access on their end date, driven by HR or the contract end date, not by memory
- [ ] Secret scanning with push protection is on for every repository, and an exposed secret is always rotated first, then cleaned up
- [ ] CI/CD authenticates to the cloud with OIDC (workload identity federation) wherever the platform supports it; no new long-lived deploy keys

## Level 2 · Established

- [ ] Phishing-resistant MFA (passkeys or FIDO2 keys) for admins and anyone with production access
- [ ] A quarterly access review of privileged roles, stale accounts (no sign-in for 90 days), guest and external accounts, and personal access tokens
- [ ] Every AI agent and MCP server has its own identity with least privilege; no agent uses a person's credentials or holds production secrets
- [ ] Secrets live in a secrets manager, and pre-commit secret scanning is in the repository template
- [ ] Conditional access: production and admin access only from managed devices, with sensible session lifetimes
- [ ] Data platforms and admin consoles only accept logins from known networks (allow-lists)
- [ ] Standing admin rights are replaced with just-in-time elevation that expires

## Level 3 · Evidenced

- [ ] Each access review is recorded with the reviewer, date and actions taken
- [ ] An inventory of non-human identities (service principals, deploy keys, tokens, agents) records an owner and an expiry for each
- [ ] Every remaining long-lived credential has a rotation date and a rotation path that has been tested

## How to do it on your platform

| Platform | What to use |
| --- | --- |
| GitHub | Require two-factor authentication for the organisation; SAML SSO (GitHub Enterprise Cloud); secret scanning with push protection; fine-grained personal access token policies; OIDC from GitHub Actions to your cloud |
| Azure DevOps | Back the organisation with Microsoft Entra ID so conditional access applies; workload identity federation for service connections; organisation policies that restrict personal access token scope and lifetime |
| GitLab | Enforce two-factor authentication; SAML SSO for groups; secret push protection; CI/CD ID tokens (OIDC) for cloud access |
| AWS | IAM Identity Center for people; IAM roles assumed through an OIDC identity provider for pipelines; IAM Access Analyzer to find unused access |
| Azure | Managed identities for workloads; Privileged Identity Management for just-in-time admin roles |
| Google Cloud | Workload Identity Federation for pipelines; the organisation policy that disables service account key creation; IAM recommender to trim unused roles |
| Microsoft 365 / Entra ID | Conditional Access with authentication strengths (phishing-resistant MFA); access reviews; sign-in logs for stale accounts |
| Google Workspace | Enforce 2-Step Verification, and allow only security keys or passkeys for admins |

## Leaked-secret runbook

1. **Revoke and rotate.** A revoked secret is useless to whoever copied it.
2. **Check usage** in the provider's audit logs for the key's whole lifetime. Decide whether it's now an incident ([GL7](07-incident-readiness.md)).
3. **Find the siblings**: `trufflehog git file://. --only-verified`
4. **Clean up** history and caches if you must. That's hygiene, not remediation.
5. **Prevent the next one** with a pre-commit hook and push protection.

## AI agents

An agent is a non-human identity, so it gets the same treatment as a service account: its own identity, the narrowest scopes that work, short-lived tokens, an owner and an expiry. Never let an agent run with a person's credentials. Once it does, its actions look like that person's in the logs, and revoking the agent means locking the person out. Keep MCP server credentials in the secrets manager and reference them from configuration, rather than pasting tokens into configuration files.

## Evidence this produces

- An MFA coverage report from your identity provider
- Access review records and joiner/mover/leaver tickets
- Secret scanning and push protection alerts, with rotation dates
- The non-human identity inventory

## Metrics

| Metric | Target |
| --- | --- |
| Phishing-resistant MFA coverage for privileged accounts | 100% |
| Accounts with no sign-in for 90+ days | 0 at each quarterly review |
| Median time to rotate a leaked secret | Same day |

## Cadence

Continuous (SSO, MFA, push protection) · on leaving (automated) · quarterly access review

## Common pitfalls

- **Assuming the provider covers logins.** Providers secure the platform; you configure who can sign in to your tenant. Read the shared responsibility matrix for every service you use.
- **Treating MFA as the finish line.** MFA protects the login, not a stolen session cookie or token. Shorten sessions and review OAuth grants ([GL5](05-suppliers-and-integrations.md)).
- **Trusting the network.** A VPN or private network is just another login. Authenticate every service as if it were public.
- **Cleaning history instead of rotating.** Rewriting Git history doesn't un-leak a secret. Rotate first.
- **Agents borrowing human tokens.** Give agents their own identities from day one.

## Maps to

| Framework | References |
| --- | --- |
| ISO/IEC 27001:2022 | A.5.15–A.5.18 access control, identity, authentication information, access rights; A.8.2 privileged access rights; A.8.5 secure authentication (direct) |
| SOC 2 (2017 TSC) | CC6.1–CC6.3 (direct) |
| ASD Essential Eight | Multi-factor authentication; Restrict administrative privileges (partial: E8 sets specific scope and requirements per maturity level) |
