# GL9 · Incident readiness

> **Outcome:** A one-page plan, written on a quiet day, tells whoever is on call at 2 AM who decides, who to call, where the evidence is, how to shut a door, and which clocks have started ticking.

## Why it matters

A detailed incident response policy is valuable, but it's hard to use in the middle of an incident. People need one page they can actually find, with names and phone numbers that are still correct. In Australia, some obligations come with deadlines, and the clock starts when you become aware of the incident, not when you're ready.

A short plan, practised twice a year, complements the full policy and makes it usable under pressure.

## Who's involved

| Role | Responsibility |
| --- | --- |
| Practice owner (often the security champion) | Keeps the one-page plan current and runs the exercises |
| Incident lead and deputy | Make decisions during an incident |
| Sponsor | Joins the tabletop exercises, approves external statements |
| Every delivery team | Owns the "shut a door" runbooks for their services, joins exercises |
| Legal and insurer | Confirm notification obligations and the insurer's process |

## Start this week

1. Copy the one-page plan below, fill in the names and numbers, and print it.
2. Write your first "shut a door" runbook: how to revoke and rotate your most important key.
3. Publish a `security.txt` file with a monitored contact.
4. Check your insurer's incident hotline and policy number are written down outside your systems.
5. Book a one-hour tabletop exercise with leadership.

## Level 1 · Baseline

- [ ] A one-page incident plan exists and is stored somewhere reachable during an outage (not only inside the systems that might be down)
- [ ] It names a decision-maker and a deputy, and lists contacts for cloud providers, insurer, legal, key suppliers and ASD's 24/7 hotline, 1300 CYBER1 (1300 292 371)
- [ ] "Shut a door" runbooks exist for revoking and rotating keys, blocking a route, disabling an account or OAuth app, and isolating a host
- [ ] The regulatory clocks that apply to you are listed with their trigger and an owner (see below)
- [ ] Outsiders can tell you about a problem: a vulnerability disclosure policy and a `security.txt` file, with a monitored contact

## Level 2 · Established

- [ ] The plan is run as a tabletop exercise with leadership twice a year, using a realistic scenario
- [ ] Something is restored from backup for real every quarter, and at least one copy of critical data can't be deleted by an attacker
- [ ] Every incident and near miss gets a post-incident review, and its actions are tracked in the monthly review

## Level 3 · Evidenced

- [ ] Exercise records, restore tests and post-incident reviews are kept as evidence
- [ ] The plan shows its last-reviewed date and who reviewed it

## The one-page incident response plan

This template follows the safeguards in [CIS Control 17: Incident Response Management](https://www.cisecurity.org/controls/incident-response-management) and the Detect, Respond and Recover functions used in [NIST SP 800-61 Rev. 3](https://csrc.nist.gov/pubs/sp/800/61/r3/final). For a fuller policy, CIS publishes a free [Incident Response Policy Template](https://www.cisecurity.org/insights/white-papers/controls-v8-1-incident-response-policy-template) for Controls v8.1. Print it or copy it as Markdown, fill in the highlighted fields, and keep it to one page.

<!-- doc:start -->

### Incident Response Plan

**[Organisation or team name]**

| Version | Last reviewed | Reviewed by | Next review |
| --- | --- | --- | --- |
| [1.0] | [date] | [name] | [date + 6 months] |

Keep a printed or offline copy. If you're reading this during an incident, go straight to section 5.

#### 1. Who's in charge `CIS 17.1, 17.5`

| Role | Name | Phone |
| --- | --- | --- |
| Incident lead (makes the calls) | [name] | [phone] |
| Deputy | [name] | [phone] |
| Technical lead | [name] | [phone] |
| Comms lead | [name] | [phone] |
| Executive sponsor | [name] | [phone] |

#### 2. What counts as an incident `CIS 17.9`

- A suspected leak of a credential, key or token
- Unauthorised access to systems, or exposure of data
- A ransomware or extortion demand
- A compromised supplier or integration
- An outage with a suspected security cause

**If in doubt, report it.**

#### 3. How to report `CIS 17.2, 17.3`

| Channel | Details |
| --- | --- |
| Chat | [channel], monitored 24/7 |
| Phone | [number] |
| Email | [address] |
| External reports | `security.txt` contact: [address] |

#### 4. Who to call `CIS 17.2`

| Who | Contact | Reference |
| --- | --- | --- |
| Cloud provider support | [number or portal] | Account ID: [id] |
| Cyber insurer | [hotline] | Policy: [number] |
| Legal | [name, phone] | |
| Key suppliers | [names, contacts] | |
| ASD's ACSC | 1300 CYBER1 (1300 292 371) | 24/7 |

#### 5. The first hour `NIST: Detect, Respond`

1. **Open an incident channel** and start a running log with times.
2. **Contain:** revoke and rotate keys, disable accounts and OAuth apps, block routes, isolate hosts.
3. **Preserve evidence** before you rebuild anything: logs, snapshots, screenshots.
4. **Assess** which systems and what data were affected.

#### 6. Clocks (Australia)

| Obligation | Deadline | Owner |
| --- | --- | --- |
| Notifiable Data Breaches | Assess within 30 days; notify as soon as practicable | [name] |
| Ransomware or extortion payment (turnover above $3 million, or critical infrastructure) | Report to ASD within 72 hours | [name] |
| SOCI critical infrastructure | 12 hours (significant impact), 72 hours (relevant impact) | [name] |

*Not legal advice. Confirm which obligations apply to you with your legal team.*

#### 7. Communicating `CIS 17.6`

| Item | Details |
| --- | --- |
| Primary channel | [tool] |
| Backup channel, if that's down | [phone bridge or other] |
| Approves statements to customers, staff and media | [name] |

#### 8. Recover `NIST: Recover`

1. Restore from known-good backups.
2. Rotate credentials again.
3. Watch closely for signs the attacker is back.
4. The incident lead confirms "back to normal" and closes the incident.

#### 9. Afterwards `CIS 17.7, 17.8`

- Blameless post-incident review within two weeks
- Actions tracked in the monthly review
- Run this plan as a tabletop exercise twice a year

<!-- doc:end -->

## Clocks that may start ticking (Australia)

| Obligation | Timeframe | Applies to |
| --- | --- | --- |
| Privacy Act, Notifiable Data Breaches scheme | Assess a suspected eligible data breach within 30 days, and notify as soon as practicable | APP entities |
| Cyber Security Act 2024, ransomware payment reporting | Report a ransomware or extortion payment to ASD within 72 hours | Businesses with annual turnover above $3 million, and responsible entities for critical infrastructure assets under Part 2B of the SOCI Act |
| SOCI Act, mandatory cyber incident reporting | 12 hours for significant impact, 72 hours for relevant impact | Responsible entities for critical infrastructure assets |

*Not legal advice. Check your obligations with your legal team.*

## How to do it on your platform

"Shut a door" runbooks should name the exact place or command. Common ones:

| Platform | Shut a door |
| --- | --- |
| GitHub | Revoke a personal access token or deploy key; suspend a GitHub App installation; rotate repository and organisation secrets |
| Azure DevOps | Revoke personal access tokens; disable a service connection; pause a pipeline |
| GitLab | Revoke personal, project or group access tokens; rotate CI/CD variables |
| AWS | Deactivate an access key (`aws iam update-access-key --access-key-id <key id> --status Inactive`); revoke active role sessions; restrict a security group |
| Azure | Disable the account in Entra ID and revoke its sessions; rotate a service principal secret; apply a network security group rule |
| Google Cloud | Disable a service account or its key; tighten a firewall rule |
| Microsoft 365 / Entra ID | Revoke a user's sessions (`Revoke-MgUserSignInSession`); disable an enterprise application |
| Google Workspace | Reset a user's sign-in cookies; remove an app's access in API controls |

## AI agents

Add agents to the plan. Know how to stop each one quickly: disable its identity, revoke its tokens, and remove its access to MCP servers and tools. If an agent did something unexpected, treat its logs as evidence, and include it in the post-incident review like any other actor. During an incident, AI assistants can help summarise logs and draft timelines, but keep sensitive incident data inside approved tools ([GL3](03-ai-usage-rules.md)).

## Evidence this produces

- The plan, with its review dates
- Records of tabletop exercises and restore tests
- Post-incident reviews and their actions

## Metrics

| Metric | Target |
| --- | --- |
| Days since the plan was last read through | Under 183 |
| Time to revoke a credential in the last exercise | Minutes, not hours |

## Cadence

Tabletop with leadership twice a year · restore test every quarter · reviewed after every incident

## Common pitfalls

- **Storing the plan in the system that's down.** Keep a printed or offline copy.
- **Out-of-date phone numbers.** Reading the plan aloud twice a year is how you find them.
- **Untested backups.** A restore test is what turns a backup into a control you can rely on.
- **Rebuilding before preserving.** Capture logs and snapshots first, or you lose the evidence you need for notification decisions.

## Sources

- CIS Control 17, Incident Response Management: https://www.cisecurity.org/controls/incident-response-management
- CIS Controls v8.1 Incident Response Policy Template: https://www.cisecurity.org/insights/white-papers/controls-v8-1-incident-response-policy-template
- NIST SP 800-61 Rev. 3, Incident Response Recommendations and Considerations for Cybersecurity Risk Management: https://csrc.nist.gov/pubs/sp/800/61/r3/final

## Maps to

| Framework | References |
| --- | --- |
| ISO/IEC 27001:2022 | A.5.24–A.5.28 incident planning, assessment, response, learning, evidence (direct); A.5.5 Contact with authorities; A.8.13 Information backup (partial) |
| SOC 2 (2017 TSC) | CC7.3–CC7.5 (direct); A1.3 recovery plan testing, if Availability is in scope (partial) |
| ASD Essential Eight | Regular backups (partial: restore testing only; E8 also sets backup scope, retention and access restrictions) |
