# GL6 · Data protection

> **Outcome:** You know what sensitive data you hold, where it lives and who can reach it. You keep only what you need, encrypt it, and production data never ends up in test.

## Why it matters

When a breach happens, the first question is what data was exposed. Teams that know what they hold, and where, can answer in hours. Teams that don't often have to assume the worst and notify everyone. In Australia, APP 11 of the Privacy Act requires reasonable steps to protect personal information, and to destroy or de-identify it once it's no longer needed.

Sensitive data also spreads quietly. Copies of production end up in test environments, exports sit in shared drives, customer details get pasted into tickets and logs, and documents are loaded into AI search indexes. Data you don't keep can't be breached, and data you've mapped can be protected.

## Who's involved

| Role | Responsibility |
| --- | --- |
| Practice owner (platform lead or data owner) | Keeps the data map, sets classification and retention rules |
| Every delivery team | Records the data their services hold, uses masked or synthetic data in non-production, implements retention and deletion |
| Privacy or legal | Confirms retention periods and privacy obligations, and reviews new uses of personal data |
| Security champion | Checks encryption, public-access settings and the data map each quarter |

## Start this week

1. List the five systems that hold the most sensitive data, with an owner and a region for each.
2. Check that public access is blocked on every storage bucket and database that holds sensitive data.
3. Find any copies of production personal data in dev or test, and plan to replace them with masked or synthetic data.
4. Pick one data set and agree how long you need to keep it.

## Level 1 · Baseline

- [ ] A data map lists which systems hold personal, financial, health or secret data, with an owner and a storage region for each
- [ ] Data is encrypted in transit (TLS) everywhere and at rest on every data store
- [ ] Dev and test environments use masked or synthetic data, never a straight copy of production personal data
- [ ] Retention periods are set for key data sets, and data is actually deleted when they end

## Level 2 · Established

- [ ] Data stores carry classification tags, and a policy blocks public access to anything tagged sensitive
- [ ] Encryption keys for the most sensitive stores are managed by you (customer-managed keys) where required, and key use is logged
- [ ] Personal data is detected and blocked or masked in logs, tickets, chat and AI prompts
- [ ] Backups of sensitive data are encrypted and only a small group can access them
- [ ] Requests to delete or export someone's data are handled through a tested process

## Level 3 · Evidenced

- [ ] The data map is reconciled with the asset register ([GL1](01-ownership.md)) every quarter
- [ ] Records show deletion and retention jobs ran
- [ ] New uses of personal data, including AI training, fine-tuning and search indexes, get a privacy impact assessment first

## What goes in the data map

| Field | Example |
| --- | --- |
| System or store | `customers-db` (PostgreSQL) |
| Owner | `team-accounts` |
| Data held | Names, emails, addresses, payment tokens |
| Classification | Confidential: personal data |
| Region | Australia East |
| Encryption | At rest with a platform key; TLS in transit |
| Retention | 7 years after account closure, then deleted |
| Copies | Nightly backup; masked copy in staging |

## How to do it on your platform

| Platform | What to use |
| --- | --- |
| AWS | S3 Block Public Access at the account level; Amazon Macie to find sensitive data in S3; AWS KMS for keys; S3 lifecycle rules for retention |
| Azure | Microsoft Purview to scan and classify data; Azure Key Vault for keys; Storage lifecycle management for retention; Azure Policy to deny public access |
| Google Cloud | Sensitive Data Protection to find and mask sensitive data; Cloud KMS for keys; bucket lifecycle rules; the organisation policy that enforces public access prevention |
| Microsoft 365 | Purview sensitivity labels, data loss prevention policies and retention policies |
| Google Workspace | Data loss prevention rules in the Admin console; Google Vault for retention |
| Databases and test data | Column-level encryption or tokenisation for the most sensitive fields; masking or synthetic-data tools when copying data to non-production |

## AI agents

Vector databases, search indexes and agent memory are data stores. Put them on the data map with an owner, a classification and access rules, and make sure they only return documents the person asking is allowed to see. Check what data an agent can read and where its outputs go. Don't feed personal data into prompts, training or fine-tuning unless the tool and the purpose are approved ([GL3](03-ai-usage-rules.md)).

## Evidence this produces

- The data map, with review dates
- Encryption and public-access settings exported from your cloud platforms
- Retention rules and records of deletion jobs
- Privacy impact assessments for new uses of personal data

## Metric

| Metric | Target |
| --- | --- |
| Sensitive data stores with an owner, a classification and encryption | 100% |

## Cadence

On creation (tags and encryption by policy) · quarterly data map review · retention jobs as scheduled · yearly retention review

## Common pitfalls

- **"Just a copy for testing."** Test copies of production data are among the least protected places personal data ends up.
- **Keeping everything forever.** Old data has little value and a large cost when it's exposed.
- **Personal data in logs.** Log the record identifier, not the record ([GL8](08-logging-and-evidence.md)).
- **Encryption as the whole answer.** Encryption at rest doesn't help if the application, or anyone who steals its credentials, can read everything.

## Maps to

| Framework | References |
| --- | --- |
| ISO/IEC 27001:2022 | A.5.12 Classification of information; A.5.34 Privacy and protection of PII; A.8.10 Information deletion; A.8.11 Data masking; A.8.24 Use of cryptography (direct). A.8.12 Data leakage prevention (partial) |
| SOC 2 (2017 TSC) | C1.1 and C1.2, if Confidentiality is in scope (partial); CC6.1 (partial) |
| Australian Privacy Act | APP 11 Security of personal information (partial: supports the reasonable steps, isn't legal compliance on its own) |
