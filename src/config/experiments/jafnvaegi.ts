import { ExperimentConfig } from '@/types';

/**
 * Jafnvægi í efnahvörfum (Chemical Equilibrium)
 * 3rd year chemistry experiment - IMPROVED VERSION v4
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
      maxPoints: 3,
      criteria: {
        good: 'Skýr lýsing á markmiðum: skoða áhrif breytinga á jafnvægisstöðu hvarfsins',
        needsImprovement: 'Tilgangur til staðar en vantar smáatriði um Le Chatelier eða jafnvægið',
        unsatisfactory: 'Mjög óljós eða vantar alveg',
      },
    },
    {
      id: 'fraedi',
      name: 'Fræðikafli',
      description: 'Theory: equilibrium definition, Le Chatelier law, factors affecting equilibrium',
      maxPoints: 7.5,
      criteria: {
        good: 'Skilgreining á efnajafnvægi, Le Chatelier lögmál ÚTSKÝRT (ekki bara nefnt) með ALMENNUM dæmum um HVERNIG áhrifaþættir (styrkur, hitastig, þrýstingur) breyta jafnvægi. Notar ALMENN dæmi eins og A+B⇌C eða "ljóst efni" án þess að tilgreina Fe³⁺, SCN⁻, FeSCN²⁺, eða liti þessara efna. ENGIR útreikningar hér. Orðalag má vera daglegt.',
        needsImprovement: 'Nefnir þætti en ÚTSKÝRIR EKKI hvernig þeir virka, eða hefur of miklar tilvísanir í tiltekna tilraun (t.d. liti efna Í ÞESSARI tilraun), eða hefur Kc jöfnu fyrir ÞESSA tilteknu tilraun í stað almennrar útskýringar',
        unsatisfactory: 'Vantar skilgreiningu á efnajafnvægi eða Le Chatelier útskýringu, eða bara telur upp þætti án þess að útskýra, eða lýsir NIÐURSTÖÐUM þessarar tilraunar í fræðikafla',
      },
      specialNote: 'CRITICAL - EXPERIMENT-SPECIFIC CONTENT CHECK: (1) Theory MUST use ONLY general examples (A+B⇌C or "dark product", "light reactant"). (2) MAJOR DEDUCTION if theory mentions: "Fe³⁺", "SCN⁻", "FeSCN²⁺", "ljósgult" (light yellow), "rautt" (red), "glært" (clear), "dökkrauð" (dark red) or ANY colors/properties specific to THIS experiment\'s chemicals. Example of BAD: "Fe³⁺(aq) er ljósgult og SCN⁻(aq) er glært en þegar þessar jónir eru blandaðar saman er fengið FeSCN²⁺(aq) sem verður rautt" - this is describing THIS experiment and belongs in Niðurstöður! (3) GOOD example: "Ef við bætum við hvarfefni A, þá færist hvarfið til hægri til að mynda meira af myndefni C" or "Segjum að myndefni sé dökkt á lit og hvarfefni ljós". (4) Kc equation should be GENERAL (aA + bB ⇌ cC + dD) or omitted, NOT for this specific reaction. (5) Must EXPLAIN how each factor works, not just list them. "Þættirnir eru styrkur, hitastig og þrýstingur" = BAD (just listing). "Ef við bætum við efni A, færist hvarfið til hægri til að nota up A og ná jafnvægi aftur" = GOOD (explains mechanism). (6) NO calculations (mólstyrkur formulas with numbers from this experiment) in theory section.',
    },
    {
      id: 'taeki',
      name: 'Tæki og efni',
      description: 'Complete list matching worksheet',
      maxPoints: 1.5,
      criteria: {
        good: 'Fullkominn listi sem passar við vinnuseðil: KSCN(s), KSCN lausn, Fe(NO₃)₃, AgNO₃, bikarglös, tilraunaglös, glasastandur, dropateljarar',
        needsImprovement: 'Listi til staðar en vantar eitt eða tvö atriði',
        unsatisfactory: 'Mjög ófullkominn listi eða vantar mörg atriði',
      },
      specialNote: 'Compare against the materials and equipment listed in the "Efni" and "Áhöld" sections of the worksheet',
    },
    {
      id: 'framkvamd',
      name: 'Framkvæmd',
      description: 'Should reference specific worksheet with brief description',
      maxPoints: 3,
      criteria: {
        good: 'Vísar í ÁKVEÐINN vinnuseðil með nafni (t.d. "Jafnvægi í efnahvörfum" eða "Jafnvægi í hvörfum" eða "sýnitilraun Jafnvægi") OG gefur stutta lýsingu. ENGIR útreikningar - þeir tilheyra AÐEINS Niðurstöðukafla.',
        needsImprovement: 'Vinnuseðilsvísun of almenn ("samkvæmt vinnuseðli" án nafns), eða hefur EINHVERJA útreikninga hér (ALVARLEGT), eða vantar nafn á vinnuseðli',
        unsatisfactory: 'Vantar vinnuseðilsvísun, eða hefur ALLA útreikninga í Framkvæmd í stað Niðurstöður (MJÖG ALVARLEGT skipulagsvilla), eða vísar bara í "vinnuseðil" án þess að tilgreina hvaða',
      },
      specialNote: 'CRITICAL - CALCULATION LOCATION CHECK: (1) If you see ANY of these in Framkvæmd, this is WRONG and requires MAJOR deduction: M = mól/L calculations, mól = M × L calculations, mass in grams calculations (0,019g KSCN, 8,08g Fe(NO₃)₃, etc.), einingagreining (unit analysis), mólmassa (molar mass) calculations. (2) Example of BAD Framkvæmd: "0,002M KSCN: M = mól/L => mól = M x L - mól = (0,002M KSCN) x (0,1L KSCN) = 0,0002 mól KSCN. 0,0002 mól KSCN (97,18 g KSCN /1 mól KSCN) = 0,019g KSCN" - ALL of this belongs in Niðurstöður! (3) Worksheet reference must be SPECIFIC: Accept "vinnuseðil Jafnvægi í efnahvörfum", "vinnuseðil um jafnvægi", "sýnitilraun jafnvægi". Do NOT accept just "samkvæmt vinnuseðli" or "kennari gerði tilraunina" without worksheet name. (4) Brief procedure description is good if present.',
    },
    {
      id: 'nidurstodur',
      name: 'Niðurstöður',
      description: 'All calculations, observations, answers to worksheet questions',
      maxPoints: 10.5,
      criteria: {
        good: 'Allir ÞRÍR útreikningar HÉRNA í Niðurstöðum (KSCN, Fe(NO₃)₃ með kristallvatni, AgNO₃), ALLAR 5 tilraunir skráðar með FULLBÚNUM Le Chatelier útskýringum (HVERNIG og HVERS VEGNA hvarfið færist), greining á inn/útvermni, engin tóm bil. Orðalag má vera daglegt ef rétt.',
        needsImprovement: 'Flestar niðurstöður til staðar en vantar 1-2 útskýringar á tilraunum, eða útskýringar eru ófullnægjandi (bara "færist til hægri" án þess að útskýra HVERS VEGNA), eða vantar einhvern útreikning',
        unsatisfactory: 'Vantar útreikninga (þeir eru kannski í röngum kafla?), eða vantar margar útskýringar á tilraunum, eða hefur bara lýsingu án greiningar ("verður rautt" án þess að segja HVERS VEGNA), eða vantar inn/útvermið greining',
      },
      specialNote: 'CHECK COMPLETENESS AND DEPTH: (1) MUST have ALL THREE calculations with complete work shown: (a) 0,002M KSCN: mól = M × L, then grams using molar mass, (b) 0,2M Fe(NO₃)₃·9H₂O: mól = M × L, then grams using 404 g/mol, (c) 0,1M AgNO₃: mól = M × L, then grams. If calculations are in Framkvæmd instead, they still count but deduct heavily in Framkvæmd section. (2) MUST have observations AND Le Chatelier explanations for ALL 5 test tubes: (a) Test 1: reference/control, (b) Test 2: add KSCN(s) → darker → why (more SCN⁻, shifts right, more FeSCN²⁺), (c) Test 3: add Fe(NO₃)₃ → darker → why (more Fe³⁺, shifts right), (d) Test 4: add AgNO₃ → lighter → why (Ag⁺ removes SCN⁻, shifts left), (e) Test 5: heat → lighter/darker → exo or endothermic determination. (3) Each explanation must include: what was added, direction of shift (til hægri/vinstri), WHY it shifts that way. "Verður rautt" alone = insufficient. Need "Verður rautt því hvarfið færist til hægri til að mynda meira FeSCN²⁺ vegna þess að við bættum við Fe³⁺" = sufficient. (4) Accept colloquial language like "hvarfið vill laga" or "þarf að bæta við" if mechanism is correct. (5) Check for blank spaces ("__") or incomplete sentences - deduct if present.',
    },
    {
      id: 'lokaord',
      name: 'Lokaorð',
      description: 'Summary with connection to theory and discussion of uncertainty',
      maxPoints: 4.5,
      criteria: {
        good: 'Samantekt tengir við Le Chatelier, UMRÆÐA um óvissu/skekkjur, SAMHENGANDI (ekki endurtaka sama aftur og aftur), HNITMIÐAÐ (ekki þvæla), stuttur og glöggur',
        needsImprovement: 'Tengsl við fræði til staðar en vantar umræðu um óvissu, eða smá óþarfa endurtekning (2-3 sinnum), eða virðist vera of langt og endurtekið',
        unsatisfactory: 'SAMHENGISLAUS (hoppar milli hugmynda), MIKIL ENDURTEKNING (4+ sinnum sama hugtakið/setningin), ÞVÆLING (segir sama hlutinn aftur og aftur með öðrum orðum), vantar umræðu um óvissu, eða tengist ekki fræðum',
      },
      specialNote: 'CHECK FOR COHERENCE AND REPETITION: (1) UNCERTAINTY discussion required (measurement errors, temperature control, or "errors were minimal"). (2) COHERENCE: Ideas should flow logically from one to next. Bad example: "Le Chatelier virkar. Hvarfið brást við. Reglan sannaðist. Le Chatelier er rétt. Niðurstöður sanna Le Chatelier." = incoherent rambling. Good example: "Niðurstöður styðja Le Chatelier því að öll fimm tilraunin sýndu..." = logical flow. (3) REPETITION CHECK - Count how many times key concepts are repeated: If "Le Chatelier" or "jafnvægi" or "hvarfið færist" appears 5+ times in a short conclusion, DEDUCT heavily. (4) VERBOSITY - "Þvæling" means saying the same thing repeatedly in different words. Example: "Hvarfið brást við breytingum. Þegar breytingar voru gerðar brást hvarfið við. Breytingar höfðu áhrif og hvarfið brást við þeim." = excessive repetition, deduct points. (5) Should be 4-6 sentences maximum for good conclusion. (6) Must be CONCISE summary, not exhaustive re-explanation of all results.',
    },
    {
      id: 'undirskrift',
      name: 'Undirskrift',
      description: 'Student signature present at bottom of report',
      maxPoints: 1.5,
      criteria: {
        good: 'Undirskrift til staðar NEÐST í skýrslu (nafn nemanda)',
        unsatisfactory: 'Undirskrift VANTAR eða er ekki neðst í skýrslu',
      },
      specialNote: 'BINARY CHECK: Signature must be present at BOTTOM of report (after conclusion section). This is simple yes/no - either student name appears at end or it doesn\'t. Check after "Lokaorð" section. If completely missing, give 0 points. If present anywhere at bottom (even if not perfectly placed), give full points.',
    },
    {
      id: 'samhengi',
      name: 'Heildarsamhengi',
      description: 'Overall coherence between sections',
      maxPoints: 1.5,
      criteria: {
        good: 'Kaflar tengist saman rökrétt, skýrslan er FULLBÚIN (engin tóm bil eða ófullgerðar setningar), innihald í réttum köflum, samhengandi og yfirlesin. Orðalag má vera daglegt.',
        needsImprovement: 'Kaflar tengist ekki vel saman, eða virðist ekki vera lesin yfir (málfræðivillur), eða smá ófullgerðir hlutar, eða EINHVER innihald í röngum kafla',
        unsatisfactory: 'Mjög lítið samhengi milli kafla, virðist ófullbúin með tómum bilum ("__") eða vantar stóra kafla, eða MIKIÐ af innihaldi í röngum köflum (t.d. allir útreikningar í Framkvæmd), eða móttsagnir',
      },
      specialNote: 'STRUCTURAL INTEGRITY CHECK: (1) COMPLETENESS: Are there blank spaces ("__"), missing sections, or incomplete sentences? Deduct if yes. (2) SECTION PLACEMENT: Is content in correct sections? Major issue if calculations in Framkvæmd or experiment-specific colors in Fræðikafli. (3) COHERENCE: Do sections flow logically? Does Tilgangur lead to Fræðikafli, which leads to Niðurstöður, which leads to Lokaorð? (4) REVIEW: Grammar errors, typos, inconsistent terminology suggest lack of proofreading. (5) Accept informal but correct language throughout. (6) This is about STRUCTURE and COMPLETENESS, not writing style. Focus on: content in right places, no missing parts, sections connect logically.',
    },
  ],
  gradeScale: ['10', '9', '8', '7', '6', '5', '4', '3', '2', '1', '0'],
};
