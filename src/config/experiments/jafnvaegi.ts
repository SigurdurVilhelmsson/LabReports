import { ExperimentConfig } from '@/types';

/**
 * Jafnvægi í efnahvörfum (Chemical Equilibrium)
 * 3rd year chemistry experiment - IMPROVED VERSION v5
 *
 * This experiment explores Le Chatelier's principle by observing
 * how an equilibrium system (Fe³⁺ + SCN⁻ ⇌ FeSCN²⁺) responds to
 * changes in concentration and temperature.
 *
 * GRADING PHILOSOPHY:
 * - LENIENT on STYLE: Accept informal/colloquial language if conceptually correct
 * - STRICT on STRUCTURE: Content must be in correct sections
 * - STRICT on COMPLETENESS: All required elements must be present
 * - STRICT on DEPTH: Must explain concepts, not just list them
 * - STRICT on EXPERIMENT-SPECIFIC CONTENT: Theory must be general
 *
 * TOTAL POINTS: 50
 */

export const jafnvaegi: ExperimentConfig = {
  id: 'jafnvaegi',
  title: 'Jafnvægi í efnahvörfum',
  year: 3,

  /**
   * GRADING INSTRUCTIONS
   * Guidelines for presenting grades clearly and consistently
   */
  gradingInstructions: {
    argumentFormat:
      'For each section, provide: (1) Points awarded out of maximum, (2) ONE brief sentence stating what was done well, (3) ONE brief sentence stating what was missing or incorrect (if applicable). Avoid lengthy explanations or repeating the criteria verbatim.',
    internalReview:
      'Before presenting the final grade, conduct an internal review: (a) Are points consistent with criteria? (b) Is any content graded in wrong section? (c) Does total reflect overall quality? (d) Are deductions justified and not duplicated? (e) Is uncertainty discussed in Lokaorð? (f) Is signature at END of report (not just title page)?',
    outputFormat: 'Present grades in a clear table format, followed by brief justifications for each section. End with the internal review confirmation.',
  },

  /**
   * INTERNAL REVIEW CHECKLIST
   * Must be completed before presenting final grade to user
   */
  reviewChecklist: [
    'Verify signature is at END of report (after Lokaorð), not just on title page',
    'Confirm calculations are graded based on content quality, with structural penalty applied only once in Framkvæmd/Heildarsamhengi',
    'Check that Fræðikafli contains NO experiment-specific content (colors like rautt/ljósgult, or Fe³⁺/SCN⁻/FeSCN²⁺ descriptions)',
    'Verify uncertainty/skekkjur is discussed in Lokaorð',
    'Ensure no double-penalties for the same issue across sections',
    'Confirm total points match sum of section points',
    'Check that grading arguments are clear and concise',
  ],

  /**
   * COMMON MISTAKES
   * Patterns observed in trial runs - handle consistently
   */
  commonMistakes: [
    {
      issue: 'Describing FeSCN²⁺ color or specific ion properties in Fræðikafli',
      section: 'fraedi',
      deduction: '3-4 points',
      handling:
        'Theory should use only generic examples (A+B⇌C, "dark product"). Specific colors (rautt, ljósgult, dökkrauð) or ion names from THIS experiment belong in Niðurstöður.',
    },
    {
      issue: 'All calculations placed in Framkvæmd instead of Niðurstöður',
      sections: ['framkvamd', 'samhengi'],
      deduction: '2 points in Framkvæmd, 1-2 points in Heildarsamhengi',
      handling:
        'Grade the calculations themselves in Niðurstöður as if correctly placed. Apply structural penalty in Framkvæmd and Heildarsamhengi. Do NOT double-penalize by also deducting in Niðurstöður.',
    },
    {
      issue: 'Name on title page only, no signature at end of report',
      section: 'undirskrift',
      deduction: 'Full points (2)',
      handling:
        'Title page name does NOT satisfy the signature requirement. Signature must appear AFTER Lokaorð section.',
    },
    {
      issue: 'No uncertainty discussion in Lokaorð',
      section: 'lokaord',
      deduction: '2 points',
      handling:
        'Uncertainty discussion is required. For this experiment, acknowledging minimal impact is acceptable.',
    },
    {
      issue: 'Listing Le Chatelier factors without explaining mechanisms',
      section: 'fraedi',
      deduction: '3-4 points',
      handling:
        '"Þættirnir eru styrkur, hitastig og þrýstingur" is insufficient. Must explain HOW each factor affects equilibrium.',
    },
  ],

  /**
   * OUTPUT TEMPLATE
   * Format for presenting grades to students
   */
  outputTemplate: `
## Einkunn: [X]/50

### Sundurliðun
| Kafli | Einkunn | Hámark |
|-------|---------|--------|
| Tilgangur | [X] | 4 |
| Fræðikafli | [X] | 12 |
| Tæki og efni | [X] | 2 |
| Framkvæmd | [X] | 4 |
| Niðurstöður | [X] | 12 |
| Lokaorð | [X] | 8 |
| Undirskrift | [X] | 2 |
| Heildarsamhengi | [X] | 6 |
| **Samtals** | **[X]** | **50** |

### Rökstuðningur

**Tilgangur ([X]/4):** [Strength] [Weakness if any]

**Fræðikafli ([X]/12):** [Strength] [Weakness if any]

**Tæki og efni ([X]/2):** [Strength] [Weakness if any]

**Framkvæmd ([X]/4):** [Strength] [Weakness if any]

**Niðurstöður ([X]/12):** [Strength] [Weakness if any]

**Lokaorð ([X]/8):** [Strength] [Weakness if any]

**Undirskrift ([X]/2):** [Present/Missing, location noted]

**Heildarsamhengi ([X]/6):** [Strength] [Weakness if any]

### Innri yfirferð
- [x] Undirskrift staðsett rétt (eftir Lokaorð)? [Já/Nei]
- [x] Útreikningar metnir á réttum stað? [Já/Nei]
- [x] Óvissa rædd í Lokaorð? [Já/Nei]
- [x] Engin tvöföld refsing? [Já/Nei]
- [x] Samtala rétt? [Já/Nei]
`,

  worksheet: {
    reaction: 'Fe³⁺(aq) + SCN⁻(aq) ⇌ FeSCN²⁺(aq)',
    materials: [
      'KSCN(s)',
      '0,002M KSCN lausn',
      '0,2 M Fe(NO₃)₃',
      '0,1 M AgNO₃ lausn',
    ],
    equipment: [
      '2 bikarglös',
      '6 tilraunaglös',
      'glasastandur',
      'dropateljarar',
    ],
    steps: [
      'Reikna út hvernig blanda skal lausnir (100 mL af hverri)',
      'Athuga KSCN lausn (litur og jónir)',
      'Kennari bætir Fe(NO₃)₃ við KSCN - sjá litabreytingu',
      'Blanda sett í 5 tilraunaglös (glas 1 = viðmiðun)',
      'Tilraun 2: Bæta við föstu KSCN → útskýra breytingu',
      'Tilraun 3: Bæta við Fe(NO₃)₃ lausn → útskýra breytingu',
      'Tilraun 4: Bæta við AgNO₃ lausn → útskýra breytingu',
      'Tilraun 5: Hita lausn í 50°C vatni → útskýra breytingu og hvort hvarfið sé inn- eða útvermið',
    ],
  },

  sections: [
    {
      id: 'tilgangur',
      name: 'Tilgangur',
      description: 'Clear 1-2 sentence statement of experiment goals',
      maxPoints: 4,
      pointGuidance: {
        '4': 'Excellent: Clear, specific statement mentioning both Le Chatelier principle and equilibrium shifts',
        '3': 'Good: Mentions goals but slightly vague on specifics',
        '2': 'Partial: Very brief or missing key elements',
        '1': 'Minimal: Present but unclear or incomplete',
        '0': 'Missing or completely off-topic',
      },
      criteria: {
        good: 'Skýr lýsing á markmiðum: skoða áhrif breytinga á jafnvægisstöðu hvarfsins og/eða prófa Le Chatelier reglu',
        needsImprovement:
          'Tilgangur til staðar en vantar smáatriði um Le Chatelier eða jafnvægið',
        unsatisfactory: 'Mjög óljós eða vantar alveg',
      },
    },
    {
      id: 'fraedi',
      name: 'Fræðikafli',
      description:
        'Theory: equilibrium definition, Le Chatelier law, factors affecting equilibrium',
      maxPoints: 12,
      pointGuidance: {
        '10-12':
          'Complete: Equilibrium clearly defined, Le Chatelier explained with mechanism, all three factors (concentration, temperature, pressure) explained with GENERAL examples',
        '7-9': 'Mostly complete: Has key concepts but one factor poorly explained OR minor experiment-specific content slipped in',
        '4-6': 'Partial: Lists factors without explaining mechanisms, OR has significant experiment-specific content (colors, ion names)',
        '1-3': 'Minimal: Mentions equilibrium or Le Chatelier but no real explanation of how it works',
        '0': 'Missing or describes only this specific experiment with no general theory',
      },
      criteria: {
        good: 'Skilgreining á efnajafnvægi, Le Chatelier lögmál ÚTSKÝRT (ekki bara nefnt) með ALMENNUM dæmum um HVERNIG áhrifaþættir (styrkur, hitastig, þrýstingur) breyta jafnvægi. Notar ALMENN dæmi eins og A+B⇌C eða "ljóst efni" án þess að tilgreina Fe³⁺, SCN⁻, FeSCN²⁺, eða liti þessara efna. ENGIR útreikningar hér. Orðalag má vera daglegt.',
        needsImprovement:
          'Nefnir þætti en ÚTSKÝRIR EKKI hvernig þeir virka, eða hefur of miklar tilvísanir í tiltekna tilraun (t.d. liti efna Í ÞESSARI tilraun), eða hefur Kc jöfnu fyrir ÞESSA tilteknu tilraun í stað almennrar útskýringar',
        unsatisfactory:
          'Vantar skilgreiningu á efnajafnvægi eða Le Chatelier útskýringu, eða bara telur upp þætti án þess að útskýra, eða lýsir NIÐURSTÖÐUM þessarar tilraunar í fræðikafla',
      },
      specialNote:
        'CRITICAL - EXPERIMENT-SPECIFIC CONTENT CHECK: (1) Theory MUST use ONLY general examples (A+B⇌C or "dark product", "light reactant"). (2) MAJOR DEDUCTION (3-4 points) if theory mentions: "Fe³⁺", "SCN⁻", "FeSCN²⁺", "ljósgult" (light yellow), "rautt" (red), "glært" (clear), "dökkrauð" (dark red) or ANY colors/properties specific to THIS experiment\'s chemicals. Example of BAD: "Fe³⁺(aq) er ljósgult og SCN⁻(aq) er glært en þegar þessar jónir eru blandaðar saman er fengið FeSCN²⁺(aq) sem verður rautt" - this is describing THIS experiment and belongs in Niðurstöður! (3) GOOD example: "Ef við bætum við hvarfefni A, þá færist hvarfið til hægri til að mynda meira af myndefni C" or "Segjum að myndefni sé dökkt á lit og hvarfefni ljós". (4) Kc equation should be GENERAL (aA + bB ⇌ cC + dD) or omitted, NOT for this specific reaction. (5) Must EXPLAIN how each factor works, not just list them. "Þættirnir eru styrkur, hitastig og þrýstingur" = BAD (just listing, deduct 3-4 points). "Ef við bætum við efni A, færist hvarfið til hægri til að nota upp A og ná jafnvægi aftur" = GOOD (explains mechanism). (6) NO calculations (mólstyrkur formulas with numbers from this experiment) in theory section.',
    },
    {
      id: 'taeki',
      name: 'Tæki og efni',
      description: 'Complete list matching worksheet',
      maxPoints: 2,
      pointGuidance: {
        '2': 'Complete list matching worksheet materials and equipment',
        '1': 'List present but missing 1-2 items',
        '0': 'Very incomplete or missing entirely',
      },
      criteria: {
        good: 'Fullkominn listi sem passar við vinnuseðil: KSCN(s), KSCN lausn, Fe(NO₃)₃, AgNO₃, bikarglös, tilraunaglös, glasastandur, dropateljarar',
        needsImprovement: 'Listi til staðar en vantar eitt eða tvö atriði',
        unsatisfactory: 'Mjög ófullkominn listi eða vantar mörg atriði',
      },
      specialNote:
        'Compare against the materials and equipment listed in the "Efni" and "Áhöld" sections of the worksheet. Accept reasonable variations in naming (e.g., "prófglös" for "tilraunaglös").',
    },
    {
      id: 'framkvamd',
      name: 'Framkvæmd',
      description: 'Should reference specific worksheet with brief description',
      maxPoints: 4,
      pointGuidance: {
        '4': 'Perfect: Specific worksheet reference by name + brief procedure description, NO misplaced content',
        '3': 'Good: Has worksheet reference and description, minor issues',
        '2': 'Acceptable: Generic worksheet reference OR some misplaced content (calculations, observations)',
        '1': 'Poor: Missing worksheet name AND has misplaced content',
        '0': 'Missing or contains extensive misplaced content with no proper procedure reference',
      },
      criteria: {
        good: 'Vísar í ÁKVEÐINN vinnuseðil með nafni (t.d. "Jafnvægi í efnahvörfum" eða "Jafnvægi í hvörfum" eða "sýnitilraun Jafnvægi") OG gefur stutta lýsingu. ENGIR útreikningar - þeir tilheyra AÐEINS Niðurstöðukafla.',
        needsImprovement:
          'Vinnuseðilsvísun of almenn ("samkvæmt vinnuseðli" án nafns), eða hefur EINHVERJA útreikninga hér (deduct 1-2 points), eða vantar nafn á vinnuseðli',
        unsatisfactory:
          'Vantar vinnuseðilsvísun, eða hefur ALLA útreikninga í Framkvæmd í stað Niðurstöður (deduct 2+ points), eða vísar bara í "vinnuseðil" án þess að tilgreina hvaða',
      },
      specialNote:
        'MISPLACED CONTENT PROTOCOL: (1) If calculations appear in Framkvæmd: GRADE the calculations themselves as if they were in Niðurstöður (give credit for correct work there), BUT deduct 1-2 points HERE in Framkvæmd for the structural error. (2) Do NOT double-penalize by also deducting in Niðurstöður for "missing" calculations that are actually present in Framkvæmd. (3) Also note in Heildarsamhengi for overall structural issues. (4) Framkvæmd should ONLY contain: worksheet reference (with name) and brief procedural description. ANYTHING ELSE (calculations, observations, color descriptions, Le Chatelier explanations) is misplaced content requiring deduction. (5) Example of BAD Framkvæmd: "0,002M KSCN: M = mól/L => mól = M x L - mól = (0,002M KSCN) x (0,1L KSCN) = 0,0002 mól KSCN. 0,0002 mól KSCN (97,18 g KSCN /1 mól KSCN) = 0,019g KSCN" - ALL of this belongs in Niðurstöður! Grade the calculation quality in Niðurstöður, deduct here for placement. (6) Worksheet reference must be SPECIFIC: Accept "vinnuseðil Jafnvægi í efnahvörfum", "vinnuseðil um jafnvægi", "sýnitilraun jafnvægi". Do NOT accept just "samkvæmt vinnuseðli" or "kennari gerði tilraunina" without worksheet name.',
    },
    {
      id: 'nidurstodur',
      name: 'Niðurstöður',
      description:
        'All calculations, observations, answers to worksheet questions',
      maxPoints: 12,
      pointGuidance: {
        '10-12':
          'Complete: All THREE calculations correct with work shown, ALL 5 test tubes documented with FULL Le Chatelier explanations (what was added, direction of shift, WHY)',
        '8-9': 'Mostly complete: Has calculations and observations, but 1-2 explanations lack depth (missing WHY)',
        '5-7': 'Partial: Missing one calculation OR several explanations are superficial ("verður rautt" without mechanism)',
        '2-4': 'Incomplete: Missing multiple calculations OR missing exo/endothermic determination OR several test tubes not explained',
        '0-1': 'Minimal: Very little content, or calculations in wrong section with nothing here',
      },
      criteria: {
        good: 'Allir ÞRÍR útreikningar HÉRNA í Niðurstöðum (KSCN, Fe(NO₃)₃ með kristallvatni, AgNO₃), ALLAR 5 tilraunir skráðar með FULLBÚNUM Le Chatelier útskýringum (HVERNIG og HVERS VEGNA hvarfið færist), greining á inn/útvermni, engin tóm bil. Orðalag má vera daglegt ef rétt.',
        needsImprovement:
          'Flestar niðurstöður til staðar en vantar 1-2 útskýringar á tilraunum, eða útskýringar eru ófullnægjandi (bara "færist til hægri" án þess að útskýra HVERS VEGNA), eða vantar einhvern útreikning',
        unsatisfactory:
          'Vantar útreikninga (þeir eru kannski í röngum kafla?), eða vantar margar útskýringar á tilraunum, eða hefur bara lýsingu án greiningar ("verður rautt" án þess að segja HVERS VEGNA), eða vantar inn/útvermið greining',
      },
      specialNote:
        'CHECK COMPLETENESS AND DEPTH: (1) MUST have ALL THREE calculations with complete work shown: (a) 0,002M KSCN: mól = M × L, then grams using molar mass, (b) 0,2M Fe(NO₃)₃·9H₂O: mól = M × L, then grams using 404 g/mol, (c) 0,1M AgNO₃: mól = M × L, then grams. NOTE: If calculations are in Framkvæmd instead, grade the QUALITY here as if they were correct, do NOT deduct here for wrong placement (that penalty is in Framkvæmd). (2) MUST have observations AND Le Chatelier explanations for ALL 5 test tubes: (a) Test 1: reference/control, (b) Test 2: add KSCN(s) → darker → why (more SCN⁻, shifts right, more FeSCN²⁺), (c) Test 3: add Fe(NO₃)₃ → darker → why (more Fe³⁺, shifts right), (d) Test 4: add AgNO₃ → lighter → why (Ag⁺ removes SCN⁻ as AgSCN precipitate, shifts left), (e) Test 5: heat → lighter → exothermic determination (if darker → endothermic). (3) Each explanation must include: what was added, direction of shift (til hægri/vinstri), WHY it shifts that way. "Verður rautt" alone = insufficient (deduct 1-2 points per incomplete explanation). Need "Verður rautt því hvarfið færist til hægri til að mynda meira FeSCN²⁺ vegna þess að við bættum við Fe³⁺" = sufficient. (4) Accept colloquial language like "hvarfið vill laga" or "þarf að bæta við" if mechanism is correct. (5) Check for blank spaces ("__") or incomplete sentences - deduct if present.',
    },
    {
      id: 'lokaord',
      name: 'Lokaorð',
      description:
        'Summary with connection to theory and discussion of uncertainty',
      maxPoints: 8,
      pointGuidance: {
        '7-8': 'Excellent: Concise summary connecting to Le Chatelier, uncertainty discussed, coherent flow, no repetition',
        '5-6': 'Good: Has key elements but minor repetition OR uncertainty discussion brief',
        '3-4': 'Partial: Missing uncertainty discussion OR significant repetition OR poor coherence',
        '1-2': 'Minimal: Rambling, excessive repetition, or disconnected from theory',
        '0': 'Missing or completely incoherent',
      },
      criteria: {
        good: 'Samantekt tengir við Le Chatelier, UMRÆÐA um óvissu/skekkjur (má vera stutt, t.d. "skekkjur höfðu lítil áhrif"), SAMHENGANDI (ekki endurtaka sama aftur og aftur), HNITMIÐAÐ (ekki þvæla), stuttur og glöggur',
        needsImprovement:
          'Tengsl við fræði til staðar en vantar umræðu um óvissu, eða smá óþarfa endurtekning (2-3 sinnum), eða virðist vera of langt og endurtekið',
        unsatisfactory:
          'SAMHENGISLAUS (hoppar milli hugmynda), MIKIL ENDURTEKNING (4+ sinnum sama hugtakið/setningin), ÞVÆLING (segir sama hlutinn aftur og aftur með öðrum orðum), vantar umræðu um óvissu, eða tengist ekki fræðum',
      },
      specialNote:
        'CHECK FOR COHERENCE, REPETITION, AND UNCERTAINTY: (1) UNCERTAINTY REQUIREMENT (CRITICAL): Student MUST discuss óvissu/skekkjur (uncertainty/errors). For THIS experiment, acceptable responses include: "Skekkjur höfðu lítil áhrif á niðurstöður" or "Óvissa í mælingum var lítil vegna eigindlegra athugana" or "Helstu skekkjuvaldar gætu verið..." or acknowledgment that this experiment relies on qualitative color observations. Missing uncertainty discussion = deduct 2 points. (2) EXPERIMENT-SPECIFIC NOTE: In this equilibrium experiment, measurement uncertainty typically has minimal effect on qualitative observations (color changes), so students acknowledging this is appropriate and should receive full credit. (3) COHERENCE: Ideas should flow logically from one to next. Bad example: "Le Chatelier virkar. Hvarfið brást við. Reglan sannaðist. Le Chatelier er rétt. Niðurstöður sanna Le Chatelier." = incoherent rambling. Good example: "Niðurstöður styðja Le Chatelier því að öll fimm tilraunin sýndu væntanlegar litabreytingar..." = logical flow. (4) REPETITION CHECK - Count how many times key concepts are repeated: If "Le Chatelier" or "jafnvægi" or "hvarfið færist" appears 5+ times in a short conclusion, deduct 2-3 points. (5) VERBOSITY - "Þvæling" means saying the same thing repeatedly in different words. Example: "Hvarfið brást við breytingum. Þegar breytingar voru gerðar brást hvarfið við. Breytingar höfðu áhrif og hvarfið brást við þeim." = excessive repetition, deduct 2-3 points. (6) Should be 4-8 sentences maximum for good conclusion. (7) Must be CONCISE summary, not exhaustive re-explanation of all results.',
    },
    {
      id: 'undirskrift',
      name: 'Undirskrift',
      description: 'Student signature present at END of report (after Lokaorð)',
      maxPoints: 2,
      pointGuidance: {
        '2': 'Signature present at END of report, after Lokaorð section',
        '0': 'Missing OR only on title page/header (not at end)',
      },
      criteria: {
        good: 'Undirskrift til staðar NEÐST í skýrslu, EFTIR Lokaorð kafla (nafn nemanda)',
        unsatisfactory:
          'Undirskrift VANTAR eða er AÐEINS á titilsíðu/haus (ekki neðst eftir Lokaorð)',
      },
      specialNote:
        'LOCATION CHECK (CRITICAL): (1) Signature must appear AFTER the Lokaorð section, at the very END of the report body. (2) A name on a TITLE PAGE or HEADER does NOT count as a signature - this is a COMMON MISTAKE that should receive 0 points. (3) Look specifically for a name appearing after all content sections are complete. (4) Common mistake: Student has "Nafn: [name]" or "Höfundur: [name]" at top of document but nothing at end - this should receive 0 points. (5) This is BINARY: either signature is at end (2 points) or it is not (0 points). (6) Accept any form of name at the end: full name, first name only, initials if clearly identifying the student.',
    },
    {
      id: 'samhengi',
      name: 'Heildarsamhengi',
      description: 'Overall coherence between sections',
      maxPoints: 6,
      pointGuidance: {
        '6': 'Excellent: All content in correct sections, complete with no blanks, logical flow, appears proofread',
        '5': 'Very good: Minor structural issues or few typos, but content well-placed',
        '4': 'Good: Some content slightly misplaced OR minor incomplete parts, generally coherent',
        '2-3': 'Fair: Notable structural issues (calculations in wrong section), OR several incomplete parts, OR poor flow',
        '1': 'Poor: Major structural problems, significant missing content, contradictions',
        '0': 'Very poor: Severely disorganized, major sections missing, incoherent',
      },
      subCriteria: {
        'Content in correct sections':
          '2 points - Major structural errors include: calculations in Framkvæmd, experiment results/colors in Fræðikafli, procedure details in Niðurstöður',
        Completeness:
          '2 points - No blank spaces ("__"), incomplete sentences, or missing sections',
        'Flow and coherence':
          '2 points - Sections connect logically, consistent terminology throughout, appears proofread (minimal typos/grammar errors)',
      },
      criteria: {
        good: 'Kaflar tengist saman rökrétt, skýrslan er FULLBÚIN (engin tóm bil eða ófullgerðar setningar), innihald í réttum köflum, samhengandi og yfirlesin. Orðalag má vera daglegt.',
        needsImprovement:
          'Kaflar tengist ekki vel saman, eða virðist ekki vera lesin yfir (málfræðivillur), eða smá ófullgerðir hlutar, eða EINHVER innihald í röngum kafla',
        unsatisfactory:
          'Mjög lítið samhengi milli kafla, virðist ófullbúin með tómum bilum ("__") eða vantar stóra kafla, eða MIKIÐ af innihaldi í röngum köflum (t.d. allir útreikningar í Framkvæmd), eða mótsagnir',
      },
      specialNote:
        'STRUCTURAL INTEGRITY CHECK: (1) COMPLETENESS: Are there blank spaces ("__"), missing sections, or incomplete sentences? Deduct 1-2 points if yes. (2) SECTION PLACEMENT: Is content in correct sections? Major issue (2 point deduction) if calculations in Framkvæmd or experiment-specific colors in Fræðikafli. Note: This is in ADDITION to deductions in those specific sections - structural issues affect overall coherence. (3) COHERENCE: Do sections flow logically? Does Tilgangur lead to Fræðikafli, which leads to Framkvæmd, which leads to Niðurstöður, which leads to Lokaorð? (4) REVIEW: Grammar errors, typos, inconsistent terminology suggest lack of proofreading - deduct 1 point for many such errors. (5) Accept informal but correct language throughout. (6) This section evaluates STRUCTURE, COMPLETENESS, and FLOW - not writing style. (7) DOUBLE-PENALTY AVOIDANCE: If you have already deducted in a specific section for misplaced content, apply only a MINOR additional deduction here (1 point) for the overall structural issue, not a full re-penalty.',
    },
  ],

  gradeScale: ['10', '9', '8', '7', '6', '5', '4', '3', '2', '1', '0'],

  /**
   * GRADE CONVERSION
   * Convert points to final grade (optional - adjust thresholds as needed)
   */
  gradeConversion: {
    '10': { min: 47, max: 50 },
    '9': { min: 42, max: 46 },
    '8': { min: 37, max: 41 },
    '7': { min: 32, max: 36 },
    '6': { min: 27, max: 31 },
    '5': { min: 22, max: 26 },
    '4': { min: 17, max: 21 },
    '3': { min: 12, max: 16 },
    '2': { min: 7, max: 11 },
    '1': { min: 1, max: 6 },
    '0': { min: 0, max: 0 },
  },
};
