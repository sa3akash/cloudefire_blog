import type { ArticleTemplate } from "./types";

export const incidentPostMortemTemplate: ArticleTemplate = {
  id: "incident-post-mortem",
  name: "Incident Post-Mortem",
  category: "DevOps",
  description: "Investigation with timeline, 5-Whys root cause, and action items.",
  defaultTitle: "Post-Mortem: [Incident Description] on [Date]",
  content: `## Incident Summary

- **Date**: October 1, 2026
- **Duration**: 24 minutes (14:10 - 14:34 UTC)
- **Severity**: P2 (Elevated latency on read operations)
- **Impact**: ~2.4% of API queries experienced response times > 500ms

---

## Timeline of Events

- **14:10 UTC**: Automated monitors detect elevated latency spike in EU-West PoP.
- **14:16 UTC**: Engineering on-call triggered and investigates database connection pools.
- **14:24 UTC**: Identified unindexed query scan following batch subscriber update.
- **14:30 UTC**: Emergency database index migration applied to edge nodes.
- **14:34 UTC**: Latency metrics restored to baseline (< 40ms). Incident resolved.

---

## Root Cause Analysis (5 Whys)

1. *Why did queries slow down?* Table scan on \`comments\` without parent index.
2. *Why was the index missing?* Migration script skipped execution on staging isolate.
3. *Why was it not caught in CI?* Synthetic test datasets did not have enough rows to trigger slow query planner thresholds.

---

## Action Items

- [ ] Add automated migration verification step to CI pipeline.
- [ ] Implement synthetic query threshold tests with 100,000+ benchmark rows.
- [ ] Configure real-time alerts for unindexed query scans in Cloudflare Analytics.
`,
};

export const caseStudyTemplate: ArticleTemplate = {
  id: "case-study",
  name: "Case Study & Migration",
  category: "Business",
  description: "Customer or architecture migration story with before/after metrics.",
  defaultTitle: "How [Company] Migrated to Cloudflare D1 and Cut Latency by 70%",
  content: `## Executive Overview

A high-level summary of the challenge, solution, and business impact.

---

## The Challenge

Describe the legacy bottlenecks, operational costs, or scaling limitations faced previously.

> [!WARNING]
> Legacy centralized databases caused cross-region latency spikes exceeding 650ms for Asia-Pacific users.

---

## The Solution & Migration Strategy

Detail the architectural shift and steps taken to ensure zero downtime.

\`\`\`mermaid
graph LR
  Legacy[Legacy Monolith] -->|Dual Write| EdgeBuffer[Edge Queue]
  EdgeBuffer --> D1[(Global D1 Database)]
  D1 --> ReadReplicas[Local Edge Replicas]
\`\`\`

---

## Quantitative Results & Impact

| Metric | Before Migration | After Migration | Improvement |
| :--- | :--- | :--- | :--- |
| Global p95 TTFB | 480ms | 42ms | **91% faster** |
| Monthly Egress Cost | $3,400 | $0 | **100% saved** |
| Deployment Frequency | Weekly | Multiple / Day | **10x velocity** |

---

## Key Takeaways

1. Edge-native architectures dramatically simplify global data distribution.
2. Zero egress bandwidth makes high-traffic media feeds economically viable.
`,
};
