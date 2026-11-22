# GL4 · Guardrailed pipeline

> **Outcome:** Every change to code, configuration and infrastructure reaches production through a protected path. A human merges, and fast automated checks catch what humans miss, including what the change exposes.

## Why it matters

A green build tells you the change does what you meant it to. It doesn't tell you what else the change does once it's live. With infrastructure as code, the diff shows what someone typed, while the plan shows what will actually happen, and the two can differ: an apply can restore a route that was removed by hand in the portal, or change resources the diff never mentioned. Reviews need to see the outcome, not just the edit.

The pipeline itself is also a target. Build servers (SolarWinds), CI actions (tj-actions) and package registries (Shai-Hulud) have all been used to reach thousands of organisations. And speed matters: exploited vulnerabilities are now the most common way into a breach, and on average attacks begin before a patch is available.

Scanners help, but they have to be fast, risk-ranked and owned. A scanner with thousands of open warnings makes it hard for anyone to spot the one that matters.

## Who's involved

| Role | Responsibility |
| --- | --- |
| Practice owner (platform or DevOps lead) | Owns the pipeline templates, branch rules, CI hardening and drift detection |
| Every delivery team | Fixes findings in their services, reads the plan on infrastructure changes, keeps dependencies current |
| Security champion | Tunes scanners, approves suppressions, watches the known-exploited list |
| Reviewers | Approve pull requests, including the plan summary for infrastructure changes |

## Start this week

1. Protect the main branch of every production repository: pull requests, one human approval, required checks, and no direct pushes, admins included.
2. Turn on secret scanning, SAST and dependency scanning for every pull request.
3. Turn on automated dependency updates in small weekly batches.
4. Post the infrastructure plan summary as a comment on every infrastructure pull request.
5. Check open findings against the CISA KEV catalogue and fix internet-facing matches first.

## Level 1 · Baseline

- [ ] Every production repo has a protected main branch: PRs required, at least one human approval, required status checks, and no direct pushes (admins included)
- [ ] Secret scanning, SAST and dependency scanning (SCA) run on every pull request
- [ ] Infrastructure, gateway and other configuration changes live in Git and go through the same PR path
- [ ] Findings are triaged by real risk (known exploited in CISA KEV, likely per EPSS, reachable, internet-facing), and every suppression has a reason, an owner and an expiry

## Level 2 · Established

- [ ] CI is hardened: actions pinned to full commit SHAs, `permissions: {}` by default with per-job grants, `persist-credentials: false`, and install scripts disabled where possible
- [ ] Dependency updates are automated (Dependabot or Renovate) in small weekly batches, with a cooldown on brand-new versions
- [ ] IaC is scanned and policy as code runs against the plan (public exposure needs an owner, no public buckets, no wildcard IAM), and a plan summary is posted on every PR so reviewers see the outcome, not just the diff
- [ ] Scheduled drift detection compares production with Git, and manual portal fixes are back-ported to Git within a day
- [ ] The pipeline uses a read-only plan role and a scoped apply role (OIDC, with an approval), and plans on untrusted PRs never get real credentials
- [ ] Terraform state lives in an encrypted remote backend with access treated like a secret, and modules and providers are pinned with the lock file committed
- [ ] Org-wide cloud guardrails deny dangerous configurations outright (such as public storage), and posture management (CSPM) runs against a baseline with findings routed to owners
- [ ] Known-exploited (CISA KEV) vulnerabilities come first, and internet-facing services are patched within 48 hours when the vendor rates the vulnerability critical or a working exploit exists
- [ ] Container images use minimal, digest-pinned base images, don't run as root, are rebuilt on a schedule, and have an SBOM
- [ ] Security checks are budgeted to minutes, and a slow check is treated as a bug

## Level 3 · Evidenced

- [ ] Release artefacts carry build provenance or signatures (for example SLSA-style attestations)
- [ ] Targeted retests after big changes, and attack-path testing against your crown jewels, not just an annual compliance-scoped pen test
- [ ] Branch protection settings and pipeline definitions are exported as evidence, and KEV-listed, internet-facing findings are fixed within an agreed timeframe

## Where each check goes

| Stage | Check | Example tools |
| --- | --- | --- |
| Laptop | Secret scan (pre-commit) | Gitleaks, TruffleHog |
| Pull request | SAST, SCA, IaC | Semgrep, CodeQL, OSV-Scanner, Checkov |
| Build | Image scan, SBOM, signing | Trivy, Grype, Syft, Cosign |
| Deploy | Policy as code | OPA/Conftest, cloud policy |
| Runtime | Posture management, logs | CSPM, Prowler |

Every check should be **early, automated, actionable and owned**. If a check has no owner, delete it.

## How to do it on your platform

| Platform | What to use |
| --- | --- |
| GitHub | Rulesets or branch protection with required reviews and status checks; code scanning (CodeQL), Dependabot, secret scanning; artifact attestations for provenance |
| Azure DevOps | Branch policies with minimum reviewers and build validation; GitHub Advanced Security for Azure DevOps for secret, code and dependency scanning; environment approvals and checks |
| GitLab | Protected branches, merge request approval rules, and the built-in SAST, dependency and secret detection templates |
| AWS | Service control policies for org-wide denies (for example S3 Block Public Access); AWS Config rules; Security Hub for posture |
| Azure | Azure Policy with deny effects; Microsoft Defender for Cloud for posture |
| Google Cloud | Organization Policy constraints (for example public access prevention on storage); Security Command Center for posture |

## Infrastructure as code: six risks that bite teams who already scan

| Risk | Why it bites | Do |
| --- | --- | --- |
| Drift and click-ops | The next apply decides who wins | Scheduled drift checks; back-port manual fixes within a day |
| The plan that isn't reviewed | Reviews see the diff, not the outcome | Plan summary on the PR; policy checks on the plan |
| State holds secrets | Terraform state is plain text | Encrypted remote state; access it like a secret |
| Over-privileged pipeline | The apply role can change everything | Read-only plan role; scoped apply via OIDC, with approval |
| Plan runs code | Providers and data sources execute during plan | No real credentials for plans on untrusted PRs |
| Unpinned modules | Someone else's module is your infrastructure | Pin versions; commit the lock file; use a mirror |

## AI agents

Agents should use the same pipeline as everyone else, with no shortcuts. They can open pull requests and run checks; a human reviews and merges. Give agent pull requests the same required checks, and ask for small, focused changes so review stays meaningful. Agents are good at the dull parts, such as dependency bumps, fixing scanner findings and writing tests, as long as a person approves the result.

## Evidence this produces

- Branch protection settings and required checks
- PR history: reviewer, checks passed, merge time
- Scanner results and suppressions with expiry dates
- Pipeline definitions in Git (pinned, least-privilege)

## Metrics

| Metric | Target |
| --- | --- |
| Time to fix known-exploited, internet-facing findings | 48 hours when vendor-critical or a working exploit exists (the Essential Eight timeframe for online services); otherwise your agreed timeframe |
| Production repos with branch protection and required checks | 100% |
| Suppressions past their expiry | 0 |

## Cadence

Every pull request · nightly drift check · weekly dependency batch · scheduled image rebuilds · monthly metric

## Common pitfalls

- **Fixing by CVSS score.** CVSS says how bad something would be, not how likely it is to happen to you. Only a small fraction of published CVEs are ever seen exploited in the wild.
- **Pinning to tags.** Tags are mutable. Pin actions to a full commit SHA.
- **Config by portal.** If it's clicked in the portal, it's not in the review, and the next apply will undo it.
- **Reading the diff, not the plan.** The diff shows what you typed. The plan shows what will happen.
- **Relying on the annual pen test.** It's a snapshot of an agreed scope. Keep it, and scan continuously in between.
- **Floating base images.** `FROM ubuntu:latest` works today, but pinning a version or digest makes builds repeatable.

## Maps to

| Framework | References |
| --- | --- |
| ISO/IEC 27001:2022 | A.8.25 Secure development life cycle; A.8.29 Security testing; A.8.32 Change management (direct). A.8.4 Access to source code; A.8.8 Technical vulnerabilities; A.8.9 Configuration management; A.8.28 Secure coding (partial) |
| SOC 2 (2017 TSC) | CC8.1 change management (direct); CC7.1 detecting configuration changes and vulnerabilities (partial) |
| ASD Essential Eight | Patch applications (partial: matches the 48-hour timeframe for online services; scanning cadences and removing unsupported software aren't covered) |
| OWASP Top 10:2025 | A02 Security Misconfiguration, A03 Software Supply Chain Failures (partial) |
