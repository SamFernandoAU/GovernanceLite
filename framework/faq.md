# FAQ

## Is GovernanceLite a replacement for ISO/IEC 27001 or SOC 2?

No. It's the set of habits that makes those certifications cheaper and more honest. At Level 3, the practices produce evidence for many of the operational controls an auditor tests, but not the management-system documents. The formal work that's left is listed in [mappings](mappings.md#whats-left-for-certification).

## Why only eight practices?

Because a framework a team can remember is one a team will follow. Each practice targets a failure that keeps showing up in real incidents, from build systems and forgotten APIs to stolen OAuth tokens and saved passwords.

## We're five engineers. Isn't this overkill?

Level 1 is designed for small teams. Most of it is settings in tools you already pay for (SSO, MFA, branch protection, secret scanning), plus three one-page documents: the asset register, the incident plan and the AI usage rules. Allow about a month at a few hours a week.

## Who owns GovernanceLite in our organisation?

A **sponsor** sets the target, a **security champion** runs the monthly review, and each practice has an **owner**. See [roles](README.md#roles).

## How does this work with AI coding agents?

Agents are treated as actors, the same as people. They get their own identities with least privilege (GL2), follow the AI usage rules (GL3), go through the same pipeline with a human merging (GL4), and have their actions logged (GL6).

## Do we have to use the tools mentioned?

No. Tools are examples. What matters is the outcome and the evidence, so use what fits your stack and budget.

## How do we show progress to leadership or customers?

Use the quarterly sponsor summary from [GL8](practices/08-monthly-review.md): your eight-practice level profile, the metric trends, top risks and decisions needed. For customer questionnaires, the Level 3 evidence and the [mappings](mappings.md) answer most security questions directly.

## Where did this come from?

GovernanceLite was introduced in the talk [*The Build Passed. The Hackers Don't Care.*](https://samfernandoau.github.io/the-build-passed/) by Sam Fernando at DDD Adelaide 2026.
