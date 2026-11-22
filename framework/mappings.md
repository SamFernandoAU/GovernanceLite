# Mappings

GovernanceLite isn't a certification. These tables show where each practice contributes to controls that auditors and customers ask about, so you can reuse its evidence.

- **Direct** means the practice's tasks address the main intent of the control.
- **Partial** means the practice covers part of the control. You'll need more to satisfy it.
- A mapping never means the control is "met". Your auditor or assessor decides that, against your scope.

References were checked against the published control titles: ISO/IEC 27001:2022 Annex A, the AICPA 2017 Trust Services Criteria (revised points of focus, 2022), the ASD Essential Eight maturity model (November 2023) and the OWASP Top 10:2025.

## ISO/IEC 27001:2022 and SOC 2

| Practice | ISO/IEC 27001:2022 | SOC 2 (2017 TSC) |
| --- | --- | --- |
| [GL1 Ownership](practices/01-ownership.md) | **Direct:** A.5.9 Inventory of information and other associated assets. **Partial:** A.5.2 Information security roles and responsibilities | **Direct:** CC6.1 (inventory of information assets point of focus). **Partial:** CC1.3 |
| [GL2 Identity and access](practices/02-identity-and-access.md) | **Direct:** A.5.15 Access control, A.5.16 Identity management, A.5.17 Authentication information, A.5.18 Access rights, A.8.2 Privileged access rights, A.8.5 Secure authentication | **Direct:** CC6.1, CC6.2, CC6.3 |
| [GL3 AI usage rules](practices/03-ai-usage-rules.md) | **Partial:** A.5.10 Acceptable use, A.5.23 Cloud services (approved AI tools), A.8.28 Secure coding | **Partial:** CC2.2, CC5.3 |
| [GL4 Secure design](practices/04-secure-design.md) | **Direct:** A.8.26 Application security requirements, A.8.27 Secure system architecture and engineering principles. **Partial:** A.5.8 Information security in project management | **Partial:** CC8.1 |
| [GL5 Guardrailed pipeline](practices/05-guardrailed-pipeline.md) | **Direct:** A.8.25 Secure development life cycle, A.8.29 Security testing in development and acceptance, A.8.32 Change management. **Partial:** A.8.4 Access to source code, A.8.8 Management of technical vulnerabilities, A.8.9 Configuration management, A.8.28 Secure coding | **Direct:** CC8.1. **Partial:** CC7.1 |
| [GL6 Data protection](practices/06-data-protection.md) | **Direct:** A.5.12 Classification of information, A.5.34 Privacy and protection of PII, A.8.10 Information deletion, A.8.11 Data masking, A.8.24 Use of cryptography. **Partial:** A.8.12 Data leakage prevention | **Partial:** CC6.1; C1.1 and C1.2, if Confidentiality is in scope |
| [GL7 Suppliers and integrations](practices/07-suppliers-and-integrations.md) | **Direct:** A.5.19–A.5.22 supplier relationships, agreements, ICT supply chain, monitoring and change. **Partial:** A.5.23 Cloud services | **Direct:** CC9.2 |
| [GL8 Logging and evidence](practices/08-logging-and-evidence.md) | **Direct:** A.8.15 Logging, A.8.16 Monitoring activities | **Direct:** CC7.2. **Partial:** CC7.3 |
| [GL9 Incident readiness](practices/09-incident-readiness.md) | **Direct:** A.5.24–A.5.28 incident planning, assessment, response, learning and evidence. **Partial:** A.5.5 Contact with authorities, A.8.13 Information backup | **Direct:** CC7.3, CC7.4, CC7.5. **Partial:** A1.3, if Availability is in scope |
| [GL10 Monthly review](practices/10-monthly-review.md) | **Partial:** Clauses 6.1, 9.1, 9.3 and 10. ISO lists required inputs for management review that the 30-minute agenda doesn't all cover | **Partial:** CC3, CC4 |

### Not covered

Plenty of Annex A is outside GovernanceLite's scope. Examples include people controls (A.6.1 screening, A.6.3 awareness training), physical controls (A.7), A.5.7 threat intelligence, A.5.29–A.5.30 business continuity and A.8.7 malware protection. In SOC 2, the same goes for most of CC1 (board oversight, HR) and the Processing Integrity and Privacy criteria. GL6 covers part of Confidentiality (C1.1 and C1.2).

## ASD Essential Eight

The Essential Eight targets internet-connected, Windows-based corporate networks, and assessments are made per strategy and maturity level. GovernanceLite doesn't replace an Essential Eight assessment. Most rows below are partial.

| Essential Eight strategy | GovernanceLite | Fit |
| --- | --- | --- |
| Patch applications | GL5: patch internet-facing services within 48 hours when the vendor rates a vulnerability critical or a working exploit exists. GL1: the asset register supports the required automated asset discovery | Partial. Scanning cadences, other timeframes and removing unsupported applications aren't covered |
| Patch operating systems | GL5's 48-hour rule applies to internet-facing servers | Partial. Workstation, server and network-device OS patching needs your endpoint and patch management |
| Multi-factor authentication | GL2 | Partial. E8 specifies which users and systems need MFA, and phishing-resistant MFA at higher levels |
| Restrict administrative privileges | GL2 | Partial. E8 adds specific requirements, such as privileged accounts not browsing the web or reading email |
| Regular backups | GL9: quarterly restore tests | Partial. E8 also covers backup scope, retention and stopping unprivileged accounts from changing or deleting backups |
| User application hardening | GL7: browser and IDE extension allow-lists | Related only. E8 requires hardened browsers whose settings users can't change, but doesn't name extension controls |
| Application control | Not covered | Use your endpoint management |
| Configure Microsoft Office macro settings | Not covered | Use your endpoint management |

### ASD Essentials

ASD launched **ASD Essentials** in October 2026, with chapters for enterprise IT, operational technology and cloud. It's the successor to the Essential Eight. ASD is maintaining both frameworks during a transition period, and Essential Eight maturity ratings don't convert into Essentials ratings. GovernanceLite hasn't been mapped to Essentials yet. Treat the Essential Eight rows above as a bridge until that mapping exists.

## OWASP Top 10:2025

| OWASP category | GovernanceLite | Fit |
| --- | --- | --- |
| A01:2025 Broken Access Control | GL4 (authorisation rules and deny-by-default tests), GL5 (tests run in the pipeline), GL1 (no forgotten endpoints) | Partial |
| A02:2025 Security Misconfiguration | GL5 (IaC scanning, policy as code, drift checks), GL1 (decommissioning) | Partial |
| A03:2025 Software Supply Chain Failures | GL5 (pinning, SBOMs, dependency hygiene), GL7 (extensions and integrations) | Partial |
| A06:2025 Insecure Design | GL4 (design reviews, threat models, abuse cases) | Partial |

The remaining categories (A04, A05 and A07–A10) are mostly about how code is written. Cover them with secure coding training, SAST and testing, which GL5 runs but doesn't define.

## What's left for certification

GovernanceLite builds the operating habits and the evidence that many controls rely on. It doesn't produce the management system around them. The remaining formal work:

**ISO/IEC 27001**

- Define the scope of your information security management system
- A formal risk assessment and treatment method
- A Statement of Applicability covering all 93 Annex A controls
- Policies approved by management
- Training records, internal audit and management review
- Stage 1 and Stage 2 audits by an accredited certification body

**SOC 2**

- Choose the Trust Services Criteria (Security is required)
- A written system description
- A control matrix
- An evidence period for Type II (often 3–12 months)
- HR controls: screening, onboarding, training
- Examination by a licensed CPA firm

**Using AI heavily?** ISO/IEC 42001 is the AI management system standard. GL3 is a lightweight starting point, not a mapping to it.

*These mappings are guidance, not legal or audit advice. GovernanceLite isn't affiliated with or endorsed by ISO, IEC, the AICPA, ASD or OWASP. Control numbers and short titles are cited for reference only; the standards themselves are available from their publishers.*
