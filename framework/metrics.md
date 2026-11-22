# Metrics: one per practice

Ten numbers, reviewed monthly. Each one should be collected automatically, or in under five minutes.

| Practice | Metric | Target | Where it comes from |
| --- | --- | --- | --- |
| [GL1 Ownership](practices/01-ownership.md) | Assets with a current owning team ÷ all assets | 100% internet-facing, 95%+ overall | Asset register, cloud tag reports |
| [GL2 Identity and access](practices/02-identity-and-access.md) | Phishing-resistant MFA coverage for privileged accounts | 100% | Identity provider reports |
| [GL3 AI usage rules](practices/03-ai-usage-rules.md) | Agent-authored PRs merged by a human | 100% | Git platform API |
| [GL4 Secure design](practices/04-secure-design.md) | High-risk changes with a threat model before release | 100% | Pull request checklist, design notes |
| [GL5 Guardrailed pipeline](practices/05-guardrailed-pipeline.md) | Time to fix known-exploited, internet-facing findings | 48 hours when vendor-critical or a working exploit exists | Scanner, ticket system |
| [GL6 Data protection](practices/06-data-protection.md) | Sensitive data stores with an owner, a classification and encryption | 100% | Data map, cloud tag and encryption reports |
| [GL7 Suppliers and integrations](practices/07-suppliers-and-integrations.md) | OAuth apps and integrations with no owner | 0 | Platform exports, supplier register |
| [GL8 Logging and evidence](practices/08-logging-and-evidence.md) | Critical systems that passed the "what was accessed?" test | 100% | Twice-yearly test results |
| [GL9 Incident readiness](practices/09-incident-readiness.md) | Days since the incident plan was last read through | Under 183 | The plan's review log |
| [GL10 Monthly review](practices/10-monthly-review.md) | Actions closed by their due date | 80%+ | Minutes, ticket system |

## Optional extras

Add these once the core ten are routine:

- Accounts with no sign-in for 90+ days (GL2)
- Median time to rotate a leaked secret (GL2)
- Suppressions past their expiry (GL5)
- Production repos with branch protection and required checks (GL5)
- Critical suppliers reviewed in the last 12 months (GL7)
- High-value alerts with a named owner (GL8)
- Last successful restore test date (GL9), target: within the last quarter
- Days since the last drift check found differences, and whether they were resolved (GL5)
- Risk acceptances past their expiry (GL10)

## Rules for metrics

1. **Trend over target.** The direction month to month matters more than hitting a number once.
2. **Every metric has an owner.** Usually the practice owner.
3. **Drop vanity metrics.** "Vulnerabilities found" goes up when scanning improves. Measure time to fix what matters.
