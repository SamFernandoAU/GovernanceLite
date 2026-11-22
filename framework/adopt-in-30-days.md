# Adopt GovernanceLite in 30 days

This plan gets a team to **Level 1 (Baseline) in all ten practices** in about a month. It assumes a sponsor who has agreed to it and roughly half a day a week from a security champion, plus a few hours from each practice owner.

> **Start with ownership.** It unlocks almost everything else: you can't review access, patch, log or decommission what nobody owns.

## Week 0 · Kick-off (1 hour)

- [ ] Sponsor agrees the target: Level 1 everywhere within 30 days
- [ ] Name a security champion and one owner per practice (one person can own several)
- [ ] Book the first [monthly review](practices/10-monthly-review.md) for day 30
- [ ] Score where you are today with the [self-check](../#/self-check) and save the export

## Week 1 · Know what you have

| Practice | Do this | Output |
| --- | --- | --- |
| [GL1 Ownership](practices/01-ownership.md) | Add `CODEOWNERS` to production repos, tag cloud accounts, and list internet-facing endpoints from DNS, certificate logs and gateway routes | Asset register v1 |
| [GL9 Incident readiness](practices/09-incident-readiness.md) | Fill in the one-page plan: decider, deputy, contacts, how to shut a door, clocks | Incident plan v1, stored offline too |
| [GL6 Data protection](practices/06-data-protection.md) | List the systems that hold sensitive data, block public access to them, and find production data in test | Data map v1 |

## Week 2 · Lock the doors

| Practice | Do this | Output |
| --- | --- | --- |
| [GL2 Identity and access](practices/02-identity-and-access.md) | Enforce MFA for everyone, remove shared admin accounts, disable leavers and accounts unused for 90 days, turn on secret scanning with push protection | MFA report, access review #1 |
| [GL2 Identity and access](practices/02-identity-and-access.md) | Run a verified-secrets scan over main repos' history, and rotate anything live | Rotation log |
| [GL7 Suppliers and integrations](practices/07-suppliers-and-integrations.md) | Export OAuth apps from your core platforms, remove what nobody owns, restrict user consent | Supplier register v1 |

## Week 3 · Guard the path to production

| Practice | Do this | Output |
| --- | --- | --- |
| [GL5 Guardrailed pipeline](practices/05-guardrailed-pipeline.md) | Protect main on production repos, and add secret, SAST and SCA checks to PRs | Pipeline checks running on every PR |
| [GL5 Guardrailed pipeline](practices/05-guardrailed-pipeline.md) | Triage the existing backlog: known exploited and internet-facing first | Ranked list, suppressions with expiry dates |
| [GL3 AI usage rules](practices/03-ai-usage-rules.md) | Publish the one-page AI rule and the approved tool list | AI usage rules v1 |
| [GL4 Secure design](practices/04-secure-design.md) | Add the design-review trigger list to your pull request template, and threat-model one change in progress | Trigger list, first design note |

## Week 4 · Be able to answer "what happened?"

| Practice | Do this | Output |
| --- | --- | --- |
| [GL8 Logging and evidence](practices/08-logging-and-evidence.md) | Inventory logs and retention for critical systems, and fix the biggest gap (usually API request logs or the identity provider audit log) | Logging standard v1 |
| [GL10 Monthly review](practices/10-monthly-review.md) | Hold the first review: metrics baseline, top 10 risks, actions | Minutes, risk register v1 |

## Day 30 · Check

- [ ] Re-run the self-check and compare it with week 0
- [ ] Sponsor gets a one-page summary: where you started, where you are, top risks, next quarter's focus

## Days 31–90 · Towards Level 2

Pick **two practices** to take to Level 2 this quarter. Good first choices:

1. **GL5 Guardrailed pipeline**: SHA-pinned actions, least-privilege tokens, automated dependency updates with a cooldown. Mostly one-line changes.
2. **GL2 Identity and access**: phishing-resistant MFA for admins, and agent identities with least privilege.

Then raise one practice per quarter in the monthly review.
