# IKS & Ethical AI — Ancient Wisdom, Responsible Intelligence

An interactive, university-level educational platform that demonstrates how **Indian Knowledge Systems (IKS)** inform modern ethical AI governance and machine learning decision-making.

---

## 1. Project Overview & Objective

This platform examines how ancient Indian philosophical traditions provide concrete, human-centred engineering safeguards for contemporary artificial intelligence systems.

The core focal use-case is an **AI-Based Student Performance Evaluation System** that identifies two critical socio-technical risks and enacts two essential governance safeguards using the following foundational principles:

- **Dharma (धर्म):** Moral responsibility, educator stewardship, and unyielding human accountability.
- **Ahimsa (अहिंसा):** Non-harm, preservation of student dignity, and the eradication of punitive, deficit-based labeling.
- **Nyaya & Samata (न्याय एवं समता):** Rigorous empirical inquiry (Pramana), contextual fairness, and recognizing that identical rules across asymmetric realities generate systemic injustice.
- **Holistic Well-being (Panchakosha & Sarve Bhavantu Sukhinah):** Multidimensional human flourishing across physical, vital, emotional, intellectual, and inner selfhood dimensions rather than reduction to an isolated scalar grade or attendance percentage.

---

## 2. Strict Design Requirements & Palette

The design strictly obeys the non-negotiable aesthetic constraints: **zero neon colors, zero fluorescent accents, zero cyberpunk aesthetics, and zero glowing effects**. The visual identity is inspired by Indian heritage architecture (mandala harmonics, stepwell lattices, torana arches) and classical academic monographs.

| Token | Hex Value | Semantic Usage |
| :--- | :--- | :--- |
| **Warm Ivory** | `#F7F3EA` | Dominant neutral page canvas (60%) |
| **Deep Heritage Green** | `#243B32` | Structural primary hero & dark surfaces (30%) |
| **Sandstone** | `#E8DDCA` | Secondary architectural panels & accents |
| **Muted Terracotta** | `#A6533C` | Primary accent for critical callouts & key principles |
| **Antique Gold** | `#B49A61` | Refined linework, spoke dividers, and badges |
| **Charcoal** | `#282923` | High-contrast editorial body text |
| **Slate Grey** | `#66675F` | Subdued metadata, captions & subtitles |
| **Soft White** | `#FFFDF8` | Structural card elevations |
| **Warm Beige** | `#DDD3C2` | Hairline dividers and frame borders |

---

## 3. Application Structure & Pages

1. **Page 1: Landing Page (`Home.tsx`)**
   - Marquee hero with custom architectural Mandala & AI network node SVG illustration.
   - Conceptual introduction to responsibility, non-harm, fairness, and holistic well-being.
   - Curriculum learning outcomes and core scenario spotlight.

2. **Page 2: Interactive Ethical AI Scenario (`EthicalScenario.tsx` & `StudentCard.tsx`)**
   - Realistic anonymized student profile (*Aarav S., B.Tech Computer Science*).
   - Interactive metric sliders for attendance, exam scores, assignment completion, and participation clicks.
   - Dynamic rule-based illustrative risk calculation with prominent educational disclaimer.
   - **"Reveal Hidden Context"** toggle disclosing rural bandwidth divides and family caregiving duties.
   - Three-way institutional decision panel with immediate ethical implications analysis.

3. **Page 3: IKS Principles Explorer (`IKSPrinciples.tsx`)**
   - 4 deep interactive principle cards: Dharma, Ahimsa, Nyaya & Samata, Panchakosha.
   - Textual roots (Taittiriya Upanishad, Nyaya Sutras, Mahabharata).
   - Translation to modern AI architectures (HITL, explainability, disaggregated testing).
   - Interactive **"Apply this principle"** sandbox controls.
   - Academic note distinguishing philosophical interpretation from historical claims.

4. **Page 4: Ethical Risk Analysis (`RiskAnalysis.tsx`)**
   - Exactly **Two Primary Risks**:
     - *Risk 1: Bias and Unfair Treatment* (proxy variables, digital divide).
     - *Risk 2: Harm to Student Well-being* (stigmatizing labeling, imposter syndrome, stress).
   - Root causes, affected populations, concrete examples, and systemic consequences.
   - Interactive qualitative severity selector with descriptive rubrics.

5. **Page 5: Safeguards and Responsible AI (`Safeguards.tsx` & `InteractiveChecklist.tsx`)**
   - Exactly **Two Primary Safeguards**:
     - *Safeguard 1: Human Oversight & Accountability* (linked to Dharma).
     - *Safeguard 2: Fairness Testing & Student-Centred Design* (linked to Nyaya & Ahimsa).
   - 10-point interactive institutional readiness checklist with live progress calculation.
   - Educational warning that a checklist alone does not replace ethical vigilance.

6. **Page 6: Ethical Decision Simulator (`DecisionSimulator.tsx`)**
   - 4 realistic dilemma cases:
     - Case 01: *The Asynchronous Achiever* (working student with top lab code).
     - Case 02: *The Bandwidth Divide* (rural student submitting in batch).
     - Case 03: *The Disputed Classroom Presence* (facial biometric camera vs. professor's insight).
     - Case 04: *The Ghost Deficit* (RFID demagnetization and data rectification rights).
   - Multi-option decisions with detailed breakdowns of benefits, risks, stakeholders, IKS principles, and expert rationales.

7. **Page 7: Learning Assessment (`Assessment.tsx`)**
   - 7 multiple-choice questions covering all core learning outcomes.
   - Immediate feedback with epistemic explanations.
   - Dynamic score tally, percentage calculation, and concept review summary.
   - Retake functionality.

8. **Page 8: Project Information & References (`About.tsx`)**
   - Problem statement, scope & limitations, expected impact, and future roadmap.
   - Verified official citations from NITI Aayog, Ministry of Education (IKS Division), UNESCO, and IEEE.
   - Final implementation verification audit.

---

## 4. Technical Architecture

- **Framework:** React 19 with TypeScript
- **Styling:** Tailwind CSS v4 with custom design tokens
- **Typography:** Cormorant Garamond (refined serif display), Cinzel (classical headings), Plus Jakarta Sans (body prose), JetBrains Mono (metrics)
- **Icons:** Lucide React
- **Animations:** Motion (Framer Motion) & CSS hardware-accelerated transforms
- **Build Tool:** Vite 8

---

## 5. Build & Deployment Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm

### Installation & Execution
```bash
# 1. Install dependencies
npm install

# 2. Start local development server (port 3000)
npm run dev

# 3. Validate TypeScript & linting
npm run lint

# 4. Compile production build
npm run build
```

---

## 6. Academic & Institutional References

1. **NITI Aayog (2021):** *Responsible AI for All: Adopting the Framework – A Practice Guide for Operationalising Principles for AI.* Government of India.
2. **Ministry of Education / AICTE (2020):** *Indian Knowledge Systems (IKS) Division Guidelines & National Education Policy (NEP) 2020.* Government of India.
3. **UNESCO (2021):** *Recommendation on the Ethics of Artificial Intelligence.* 41st General Conference.
4. **IEEE Global Initiative (2019):** *Ethically Aligned Design: A Vision for Prioritizing Human Well-being with Autonomous and Intelligent Systems.* First Edition.
5. **Classical Treatises:** *Taittiriya Upanishad (Panchakosha Viveka)* and *Nyaya Sutras of Aksapada Gautama (Pramana-vada).*
6. **ACM FAccT (2022):** *Algorithmic Injustice in Higher Education: Predictive Analytics and the Reinforcement of Historical Disadvantage.*
