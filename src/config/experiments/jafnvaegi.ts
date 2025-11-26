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
 * GRADING INSTRUCTIONS:
 * - For each section, provide: (1) Points awarded out of maximum, (2) ONE brief sentence stating what was done well, (3) ONE brief sentence stating what was missing or incorrect (if applicable).
 * - Avoid lengthy explanations or repeating the criteria verbatim.
 * - Before presenting the final grade, conduct an internal review (see REVIEW CHECKLIST below).
 *
 * REVIEW CHECKLIST (complete before presenting grade):
 * [ ] Verify signature is at END of report (after Lokaorð), not just on title page
 * [ ] Confirm calculations are graded based on content quality, with structural penalty applied only once in Framkvæmd/Heildarsamhengi
 * [ ] Check that Fræðikafli contains NO experiment-specific content (colors like rautt/ljósgult, or Fe³⁺/SCN⁻/FeSCN²⁺ descriptions)
 * [ ] Verify uncertainty/skekkjur is discussed in Lokaorð
 * [ ] Ensure no double-penalties for the same issue across sections
 * [ ] Confirm total points match sum of section points
 *
 * COMMON MISTAKES TO HANDLE CONSISTENTLY:
 * 1. Describing FeSCN²⁺ color in Fræðikafli → Deduct 3-4 points (belongs in Niðurstöður)
 * 2. All calculations in Framkvæmd → Grade calc quality in Niðurstöður, deduct 2 pts in Framkvæmd, note in Heildarsamhengi
 * 3. Name on title page only → 0 points for Undirskrift (must be at END)
 * 4. No uncertainty discussion → Deduct 2 points in Lokaorð
 * 5. Listing factors without explaining mechanisms → Deduct 3-4 points in Fræðikafli
 *
 * OUTPUT FORMAT:
 * ## Einkunn: [X]/50
 * | Kafli | Einkunn | Hámark |
 * |-------|---------|--------|
 * | Tilgangur | [X] | 4 |
 * | Fræðikafli | [X] | 12 |
 * | Tæki og efni | [X] | 2 |
 * | Framkvæmd | [X] | 4 |
 * | Niðurstöður | [X] | 12 |
 * | Lokaorð | [X] | 8 |
 * | Undirskrift | [X] | 2 |
 * | Heildarsamhengi | [X] | 6 |
 * | **Samtals** | **[X]** | **50** |
 *
 * TOTAL POINTS: 50
 */

export const jafnvaegi: ExperimentConfig = {
  id: 'jafnvaegi',
  title: 'Jafnvægi í efnahvörfum',
  year: 3,
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
      criteria: {
        good: 'Skýr lýsing á markmiðum: skoða áhrif breytinga á jafnvægisstöðu hvarfsins og/eða prófa Le Chatelier reglu',
        needsImprovement:
          'Tilgangur til staðar en vantar smáatriði um Le Chatelier eða jafnvægið',
        unsatisfactory: 'Mjög óljós eða vantar alveg',
      },
      specialNote:
        'POINT GUIDANCE: 4 pts = Clear, specific statement mentioning both Le Chatelier principle and equilibrium shifts. 3 pts = Mentions goals but slightly vague on specifics. 2 pts = Very brief or missing key elements. 1 pt = Present but unclear or incomplete. 0 pts = Missing or completely off-topic.',
    },
    {
      id: 'fraedi',
      name: 'Fræðikafli',
      description:
        'Theory: equilibrium definition, Le Chatelier law, factors affecting equilibrium',
      maxPoints: 12,
      criteria: {
        good: 'Skilgreining á efnajafnvægi, Le Chatelier lögmál ÚTSKÝRT (ekki bara nefnt) með ALMENNUM dæmum um HVERNIG áhrifaþættir (styrkur, hitastig, þrýstingur) breyta jafnvægi. Notar ALMENN dæmi eins og A+B⇌C eða "ljóst efni" án þess að tilgreina Fe³⁺, SCN⁻, FeSCN²⁺, eða liti þessara efna. ENGIR útreikningar hér. Orðalag má vera daglegt.',
        needsImprovement:
          'Nefnir þætti en ÚTSKÝRIR EKKI hvernig þeir virka, eða hefur of miklar tilvísanir í tiltekna tilraun (t.d. liti efna Í ÞESSARI tilraun), eða hefur Kc jöfnu fyrir ÞESSA tilteknu tilraun í stað almennrar útskýringar',
        unsatisfactory:
          'Vantar skilgreiningu á efnajafnvægi eða Le Chatelier útskýringu, eða bara telur upp þætti án þess að útskýra, eða lýsir NIÐURSTÖÐUM þessarar tilraunar í fræðikafla',
      },
      specialNote:
        'POINT GUIDANCE: 10-12 pts = Complete (equilibrium defined, Le Chatelier explained with mechanism, all three factors with GENERAL examples). 7-9 pts = Mostly complete (has key concepts but one factor poorly explained OR minor experiment-specific content). 4-6 pts = Partial (lists factors without explaining mechanisms OR significant experiment-specific content). 1-3 pts = Minimal (mentions concepts but no real explanation). 0 pts = Missing or describes only this specific experiment. --- CRITICAL EXPERIMENT-SPECIFIC CONTENT CHECK: (1) Theory MUST use ONLY general examples (A+B⇌C or "dark product", "light reactant"). (2) MAJOR DEDUCTION (3-4 points) if theory mentions: "Fe³⁺", "SCN⁻", "FeSCN²⁺", "ljósgult" (light yellow), "rautt" (red), "glært" (clear), "dökkrauð" (dark red) or ANY colors/properties specific to THIS experiment\'s chemicals. Example of BAD: "Fe³⁺(aq) er ljósgult og SCN⁻(aq) er glært en þegar þessar jónir eru blandaðar saman er fengið FeSCN²⁺(aq) sem verður rautt" - this is describing THIS experiment and belongs in Niðurstöður! (3) GOOD example: "Ef við bætum við hvarfefni A, þá færist hvarfið til hægri til að mynda meira af myndefni C" or "Segjum að myndefni sé dökkt á lit og hvarfefni ljós". (4) Kc equation should be GENERAL (aA + bB ⇌ cC + dD) or omitted, NOT for this specific reaction. (5) Must EXPLAIN how each factor works, not just list them. "Þættirnir eru styrkur, hitastig og þrýstingur" = BAD (just listing, deduct 3-4 points). "Ef við bætum við efni A, færist hvarfið til hægri til að nota upp A og ná jafnvægi aftur" = GOOD (explains mechanism). (6) NO calculations (mólstyrkur formulas with numbers from this experiment) in theory section.',
    },
    {
      id: 'taeki',
      name: 'Tæki og efni',
      description: 'Complete list matching worksheet',
      maxPoints: 2,
      criteria: {
        good: 'Fullkominn listi sem passar við vinnuseðil: KSCN(s), KSCN lausn, Fe(NO₃)₃, AgNO₃, bikarglös, tilraunaglös, glasastandur, dropateljarar',
        needsImprovement: 'Listi til staðar en vantar eitt eða tvö atriði',
        unsatisfactory: 'Mjög ófullkominn listi eða vantar mörg atriði',
      },
      specialNote:
        'POINT GUIDANCE: 2 pts = Complete list matching worksheet. 1 pt = List present but missing 1-2 items. 0 pts = Very incomplete or missing. Compare against the materials and equipment listed in the "Efni" and "Áhöld" sections of the worksheet. Accept reasonable variations in naming (e.g., "prófglös" for "tilraunaglös").',
    },
    {
      id: 'framkvamd',
      name: 'Framkvæmd',
      description: 'Should reference specific worksheet with brief description',
      maxPoints: 4,
      criteria: {
        good: 'Vísar í ÁKVEÐINN vinnuseðil með nafni (t.d. "Jafnvægi í efnahvörfum" eða "Jafnvægi í hvörfum" eða "sýnitilraun Jafnvægi") OG gefur stutta lýsingu. ENGIR útreikningar - þeir tilheyra AÐEINS Niðurstöðukafla.',
        needsImprovement:
          'Vinnuseðilsvísun of almenn ("samkvæmt vinnuseðli" án nafns), eða hefur EINHVERJA útreikninga hér (deduct 1-2 points), eða vantar nafn á vinnuseðli',
        unsatisfactory:
          'Vantar vinnuseðilsvísun, eða hefur ALLA útreikninga í Framkvæmd í stað Niðurstöður (deduct 2+ points), eða vísar bara í "vinnuseðil" án þess að tilgreina hvaða',
      },
      specialNote:
        'POINT GUIDANCE: 4 pts = Perfect (specific worksheet reference by name + brief procedure description, NO misplaced content). 3 pts = Good (has worksheet reference and description, minor issues). 2 pts = Acceptable (generic worksheet reference OR some misplaced content). 1 pt = Poor (missing worksheet name AND has misplaced content). 0 pts = Missing or extensive misplaced content with no proper reference. --- MISPLACED CONTENT PROTOCOL: (1) If calculations appear in Framkvæmd: GRADE the calculations themselves as if they were in Niðurstöður (give credit for correct work there), BUT deduct 1-2 points HERE in Framkvæmd for the structural error. (2) Do NOT double-penalize by also deducting in Niðurstöður for "missing" calculations that are actually present in Framkvæmd. (3) Also note in Heildarsamhengi for overall structural issues. (4) Framkvæmd should ONLY contain: worksheet reference (with name) and brief procedural description. ANYTHING ELSE (calculations, observations, color descriptions, Le Chatelier explanations) is misplaced content requiring deduction. (5) Worksheet reference must be SPECIFIC: Accept "vinnuseðil Jafnvægi í efnahvörfum", "vinnuseðil um jafnvægi", "sýnitilraun jafnvægi". Do NOT accept just "samkvæmt vinnuseðli" or "kennari gerði tilraunina" without worksheet name.',
    },
    {
      id: 'nidurstodur',
      name: 'Niðurstöður',
      description:
        'All calculations, observations, answers to worksheet questions',
      maxPoints: 12,
      criteria: {
        good: 'Allir ÞRÍR útreikningar HÉRNA í Niðurstöðum (KSCN, Fe(NO₃)₃ með kristallvatni, AgNO₃), ALLAR 5 tilraunir skráðar með FULLBÚNUM Le Chatelier útskýringum (HVERNIG og HVERS VEGNA hvarfið færist), greining á inn/útvermni, engin tóm bil. Orðalag má vera daglegt ef rétt.',
        needsImprovement:
          'Flestar niðurstöður til staðar en vantar 1-2 útskýringar á tilraunum, eða útskýringar eru ófullnægjandi (bara "færist til hægri" án þess að útskýra HVERS VEGNA), eða vantar einhvern útreikning',
        unsatisfactory:
          'Vantar útreikninga (þeir eru kannski í röngum kafla?), eða vantar margar útskýringar á tilraunum, eða hefur bara lýsingu án greiningar ("verður rautt" án þess að segja HVERS VEGNA), eða vantar inn/útvermið greining',
      },
      specialNote:
        'POINT GUIDANCE: 10-12 pts = Complete (all THREE calculations correct with work shown, ALL 5 test tubes documented with FULL Le Chatelier explanations). 8-9 pts = Mostly complete (has calculations and observations, but 1-2 explanations lack depth). 5-7 pts = Partial (missing one calculation OR several superficial explanations). 2-4 pts = Incomplete (missing multiple calculations OR missing exo/endothermic determination). 0-1 pts = Minimal (very little content). --- CHECK COMPLETENESS AND DEPTH: (1) MUST have ALL THREE calculations with complete work shown: (a) 0,002M KSCN: mól = M × L, then grams using molar mass, (b) 0,2M Fe(NO₃)₃·9H₂O: mól = M × L, then grams using 404 g/mol, (c) 0,1M AgNO₃: mól = M × L, then grams. NOTE: If calculations are in Framkvæmd instead, grade the QUALITY here as if they were correct, do NOT deduct here for wrong placement (that penalty is in Framkvæmd). (2) MUST have observations AND Le Chatelier explanations for ALL 5 test tubes: (a) Test 1: reference/control, (b) Test 2: add KSCN(s) → darker → why (more SCN⁻, shifts right, more FeSCN²⁺), (c) Test 3: add Fe(NO₃)₃ → darker → why (more Fe³⁺, shifts right), (d) Test 4: add AgNO₃ → lighter → why (Ag⁺ removes SCN⁻ as AgSCN precipitate, shifts left), (e) Test 5: heat → lighter → exothermic (if darker → endothermic). (3) Each explanation must include: what was added, direction of shift, WHY it shifts. "Verður rautt" alone = insufficient. Need "Verður rautt því hvarfið færist til hægri til að mynda meira FeSCN²⁺ vegna þess að við bættum við Fe³⁺" = sufficient. (4) Accept colloquial language if mechanism is correct. (5) Check for blank spaces ("__") - deduct if present.',
    },
    {
      id: 'lokaord',
      name: 'Lokaorð',
      description:
        'Summary with connection to theory and discussion of uncertainty',
      maxPoints: 8,
      criteria: {
        good: 'Samantekt tengir við Le Chatelier, UMRÆÐA um óvissu/skekkjur (má vera stutt, t.d. "skekkjur höfðu lítil áhrif"), SAMHENGANDI (ekki endurtaka sama aftur og aftur), HNITMIÐAÐ (ekki þvæla), stuttur og glöggur',
        needsImprovement:
          'Tengsl við fræði til staðar en vantar umræðu um óvissu, eða smá óþarfa endurtekning (2-3 sinnum), eða virðist vera of langt og endurtekið',
        unsatisfactory:
          'SAMHENGISLAUS (hoppar milli hugmynda), MIKIL ENDURTEKNING (4+ sinnum sama hugtakið/setningin), ÞVÆLING (segir sama hlutinn aftur og aftur með öðrum orðum), vantar umræðu um óvissu, eða tengist ekki fræðum',
      },
      specialNote:
        'POINT GUIDANCE: 7-8 pts = Excellent (concise summary connecting to Le Chatelier, uncertainty discussed, coherent flow, no repetition). 5-6 pts = Good (has key elements but minor repetition OR brief uncertainty discussion). 3-4 pts = Partial (missing uncertainty discussion OR significant repetition OR poor coherence). 1-2 pts = Minimal (rambling, excessive repetition, or disconnected from theory). 0 pts = Missing or completely incoherent. --- UNCERTAINTY REQUIREMENT (CRITICAL): Student MUST discuss óvissu/skekkjur (uncertainty/errors). For THIS experiment, acceptable responses include: "Skekkjur höfðu lítil áhrif á niðurstöður" or "Óvissa í mælingum var lítil vegna eigindlegra athugana" or acknowledgment that this experiment relies on qualitative color observations. Missing uncertainty discussion = deduct 2 points. EXPERIMENT-SPECIFIC NOTE: In this equilibrium experiment, measurement uncertainty typically has minimal effect on qualitative observations (color changes), so students acknowledging this is appropriate. --- COHERENCE CHECK: Ideas should flow logically. Bad example: "Le Chatelier virkar. Hvarfið brást við. Reglan sannaðist." = incoherent rambling. Good example: "Niðurstöður styðja Le Chatelier því að öll fimm tilraunin sýndu væntanlegar litabreytingar..." = logical flow. --- REPETITION CHECK: If "Le Chatelier" or "jafnvægi" appears 5+ times in a short conclusion, deduct 2-3 points. Should be 4-8 sentences maximum.',
    },
    {
      id: 'undirskrift',
      name: 'Undirskrift',
      description: 'Student signature present at END of report (after Lokaorð)',
      maxPoints: 2,
      criteria: {
        good: 'Undirskrift til staðar NEÐST í skýrslu, EFTIR Lokaorð kafla (nafn nemanda)',
        unsatisfactory:
          'Undirskrift VANTAR eða er AÐEINS á titilsíðu/haus (ekki neðst eftir Lokaorð)',
      },
      specialNote:
        'POINT GUIDANCE: 2 pts = Signature present at END of report, after Lokaorð. 0 pts = Missing OR only on title page/header. --- LOCATION CHECK (CRITICAL): (1) Signature must appear AFTER the Lokaorð section, at the very END of the report body. (2) A name on a TITLE PAGE or HEADER does NOT count as a signature - this is a COMMON MISTAKE that should receive 0 points. (3) Look specifically for a name appearing after all content sections are complete. (4) Common mistake: Student has "Nafn: [name]" or "Höfundur: [name]" at top of document but nothing at end - this should receive 0 points. (5) This is BINARY: either signature is at end (2 points) or it is not (0 points). (6) Accept any form of name at the end: full name, first name only, initials if clearly identifying the student.',
    },
    {
      id: 'samhengi',
      name: 'Heildarsamhengi',
      description: 'Overall coherence between sections',
      maxPoints: 6,
      criteria: {
        good: 'Kaflar tengist saman rökrétt, skýrslan er FULLBÚIN (engin tóm bil eða ófullgerðar setningar), innihald í réttum köflum, samhengandi og yfirlesin. Orðalag má vera daglegt.',
        needsImprovement:
          'Kaflar tengist ekki vel saman, eða virðist ekki vera lesin yfir (málfræðivillur), eða smá ófullgerðir hlutar, eða EINHVER innihald í röngum kafla',
        unsatisfactory:
          'Mjög lítið samhengi milli kafla, virðist ófullbúin með tómum bilum ("__") eða vantar stóra kafla, eða MIKIÐ af innihaldi í röngum köflum (t.d. allir útreikningar í Framkvæmd), eða mótsagnir',
      },
      specialNote:
        'POINT GUIDANCE: 6 pts = Excellent (all content in correct sections, complete, logical flow, proofread). 5 pts = Very good (minor structural issues or few typos). 4 pts = Good (some content slightly misplaced OR minor incomplete parts). 2-3 pts = Fair (notable structural issues OR several incomplete parts). 1 pt = Poor (major structural problems, significant missing content). 0 pts = Very poor (severely disorganized, major sections missing). --- SUB-CRITERIA BREAKDOWN: (a) Content in correct sections: 2 points - Major errors include calculations in Framkvæmd, experiment results in Fræðikafli. (b) Completeness: 2 points - No blank spaces ("__"), incomplete sentences, or missing sections. (c) Flow and coherence: 2 points - Sections connect logically, consistent terminology, appears proofread. --- STRUCTURAL INTEGRITY CHECK: (1) COMPLETENESS: Blank spaces or incomplete sentences? Deduct 1-2 points. (2) SECTION PLACEMENT: Content in wrong sections? Deduct up to 2 points. Note: This is in ADDITION to deductions in specific sections, but avoid excessive double-penalty - if already deducted in Framkvæmd for misplaced calculations, apply only 1 point here for structural issue. (3) COHERENCE: Do sections flow logically? Does Tilgangur lead to Fræðikafli → Framkvæmd → Niðurstöður → Lokaorð? (4) PROOFREADING: Many grammar errors or typos suggest lack of review - deduct 1 point.',
    },
  ],
  gradeScale: ['10', '9', '8', '7', '6', '5', '4', '3', '2', '1', '0'],
};
