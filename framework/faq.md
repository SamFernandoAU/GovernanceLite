# FAQ

## Is GovernanceLite a replacement for ISO/IEC 27001 or SOC 2?

No. It isn't a replacement for robust frameworks like ISO/IEC 27001, SOC 2 or the NIST Cybersecurity Framework. It's a practical start for teams that aren't chasing a certification yet, and the set of habits that makes a certification cheaper and more honest when you do. At Level 3, the practices produce evidence for many of the operational controls an auditor tests, but not the management-system documents. The formal work that's left is listed in [mappings](mappings.md#whats-left-for-certification).

## Why only ten practices, when ISO 27001 has 93 controls?

ISO/IEC 27001, SOC 2 and the NIST Cybersecurity Framework cover a whole organisation, including HR, physical security, legal and board oversight. GovernanceLite covers the habits an engineering team owns day to day, so it's deliberately smaller. A framework a team can remember is one a team will follow. Each practice targets a failure that keeps showing up in real incidents, from insecure designs and forgotten APIs to stolen OAuth tokens and production data in test. See [mappings](mappings.md) for what's covered and what isn't.

## We're five engineers. Isn't this overkill?

Level 1 is designed for small teams. Most of it is settings in tools you already pay for (SSO, MFA, branch protection, secret scanning), plus three one-page documents: the asset register, the incident plan and the AI usage rules. Allow about a month at a few hours a week.

## Who owns GovernanceLite in our organisation?

A **sponsor** sets the target, a **security champion** runs the monthly review, and each practice has an **owner**. See [roles](README.md#roles).

## How does this work with AI coding agents?

Agents are treated as actors, the same as people. They get their own identities with least privilege (GL2), follow the AI usage rules (GL3), are included in threat models (GL4), go through the same pipeline with a human merging (GL5), and have their actions logged (GL8).

## Do we have to use the tools mentioned?

No. Tools are examples. What matters is the outcome and the evidence, so use what fits your stack and budget.

## How do we show progress to leadership or customers?

Use the quarterly sponsor summary from [GL10](practices/10-monthly-review.md): your ten-practice level profile, the metric trends, top risks and decisions needed. For customer questionnaires, the Level 3 evidence and the [mappings](mappings.md) answer most security questions directly.

## Where did this come from?

GovernanceLite was introduced in the talk [*The Build Passed. The Hackers Don't Care.*](https://samfernandoau.github.io/the-build-passed/) by Sam Fernando at DDD Adelaide 2026.
