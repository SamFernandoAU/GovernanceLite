# GL8 · Logging and evidence

> **Outcome:** For any sensitive system, you can answer who did what, to which record, when and from where, for humans and agents alike. The logs exist before you need them.

## Why it matters

You can't investigate what you didn't log. If an API serving customer data has no request logs, you usually have to assume every record was taken, which turns a small incident into a large notification. In the Storm-0558 incident, a government agency spotted attackers reading its email because it had a mail-access audit log. Many other organisations couldn't check, because that log was only in a premium licence tier at the time.

Logging is a design decision. Make it before the incident, not during it.

## Who's involved

| Role | Responsibility |
| --- | --- |
| Practice owner (platform or operations lead) | Owns the central log store, retention and integrity settings |
| Every delivery team | Adds request logging to their services and owns the alerts for them |
| Security champion | Keeps the log inventory, runs the twice-yearly investigation test |
| Legal or privacy | Confirms retention covers breach assessment and legal needs |

## Start this week

1. List your critical systems and, for each, which logs exist and how long they're kept.
2. Check which audit events your Microsoft 365 or Google Workspace licence records, and for how long.
3. Make sure cloud audit logs go to a store the application's own credentials can't delete.
4. Pick one sensitive API and ask: "what did this serve last Tuesday, and to whom?" Note what you couldn't answer.

## Level 1 · Baseline

- [ ] For each critical system, you know which logs exist and how long they're kept: cloud audit logs, identity provider sign-ins, Microsoft 365 or Workspace audit, and gateway or API request logs
- [ ] Request logs for sensitive APIs record the actor, action, resource identifier, UTC timestamp and source IP, but not the record contents
- [ ] Logs go to a central store that the application's own credentials can't delete or change
- [ ] A retention period is decided and written down, and it covers your breach-assessment window and legal needs

## Level 2 · Established

- [ ] Data-access audit logs are enabled for sensitive data (for example Microsoft 365 MailItemsAccessed, AWS CloudTrail data events, Google Cloud Data Access audit logs)
- [ ] Agent and automation actions are logged under the agent's own identity
- [ ] A handful of high-value alerts each have an owner: sign-in anomalies, MFA changes, new OAuth grants with broad scopes, one key reading an unusual number of records, and logging being turned off
- [ ] Clock synchronisation is checked, so timelines line up across systems

## Level 3 · Evidenced

- [ ] Twice a year, an investigation query is tested for each critical system ("what did this API serve last Tuesday, and to whom?")
- [ ] Log retention and integrity settings are exported as evidence

## A log line that answers all four questions

```json
{
  "ts": "2026-11-20T23:14:07.512Z",
  "actor": "apikey:partner-17",
  "action": "GET /v1/customers/{id}",
  "resource": "customer:10236",
  "status": 200,
  "src_ip": "203.0.113.42",
  "trace_id": "4bf92f3577b34da6"
}
```

## How to do it on your platform

| Platform | What to use |
| --- | --- |
| AWS | An organisation trail in CloudTrail, with data events for sensitive buckets and tables, delivered to a separate log account with S3 Object Lock |
| Azure | Activity log and resource diagnostic settings sent to a Log Analytics workspace; immutable storage for long-term copies |
| Google Cloud | Cloud Audit Logs with Data Access logs turned on for sensitive services (most are off by default), routed to a locked log bucket |
| Microsoft 365 / Entra ID | Microsoft Purview Audit; export Entra sign-in and audit logs to your log store, because built-in retention is short |
| Google Workspace | Admin console audit and investigation tools; export logs to BigQuery where your edition supports it |
| GitHub | Organisation audit log, with audit log streaming on Enterprise Cloud |
| Azure DevOps | Auditing, with audit streams to your log store |
| GitLab | Audit events, with streaming on supported tiers |

## Check you have the mail-access log (Microsoft 365)

```kusto
CloudAppEvents
| where Timestamp > ago(7d)
| where ActionType == "MailItemsAccessed"
| summarize events = count() by AccountDisplayName
| top 10 by events
```

No rows means you couldn't answer the question either. Check that auditing is on, which licence tier you have, and how long logs are kept.

## AI agents

Every agent action that changes something (tool calls, commits, deployments, data changes) should be logged under the agent's own identity, with the person or trigger that started it where you can capture that. Keep prompts and outputs only where your data rule allows ([GL3](03-ai-usage-rules.md)), because logs that copy sensitive prompts become a store of sensitive data themselves.

## Evidence this produces

- The log inventory and retention settings
- Alert rules and their owners
- Results of the twice-yearly investigation test

## Metrics

| Metric | Target |
| --- | --- |
| Critical systems that passed the "what was accessed?" test | 100% |
| High-value alerts with a named owner | 100% |

## Cadence

Designed in at build time · alerts reviewed monthly · investigation test twice a year

## Common pitfalls

- **Logging the data instead of the identifier.** Logs shouldn't become the next breach.
- **Logs the attacker can delete.** If the app's credentials can delete its logs, so can anyone who steals them.
- **Assuming the default tier is enough.** Find out what your licence actually records, and for how long.
- **Alerts nobody owns.** Alerts without an owner tend to be missed. A few well-owned alerts beat many unowned ones.

## Maps to

| Framework | References |
| --- | --- |
| ISO/IEC 27001:2022 | A.8.15 Logging; A.8.16 Monitoring activities (direct) |
| SOC 2 (2017 TSC) | CC7.2 monitoring for anomalies (direct); CC7.3 evaluating events (partial) |
