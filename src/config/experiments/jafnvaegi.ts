import { ExperimentConfig } from '@/types';

/**
 * Jafnvægi í efnahvörfum (Chemical Equilibrium)
 * 3rd year chemistry experiment - BALANCED VERSION v3
 *
 * This experiment explores Le Chatelier's principle by observing
 * how an equilibrium system (Fe³⁺ + SCN⁻ ↔ FeSCN²⁺) responds to
 * changes in concentration and temperature.
 *
 * GRADING PHILOSOPHY:
 * - LENIENT on STYLE: Accept informal/colloquial language if conceptually correct
 * - STRICT on STRUCTURE: Content must be in correct sections
 * - STRICT on COMPLETENESS: All required elements must be present
 * - STRICT on DEPTH: Must explain concepts, not just list them
 */
export const jafnvaegi: ExperimentConfig = {
  id: 'jafnvaegi',
  title: 'Jafnvægi í efnahvörfum',
  year: 3,
  worksheet: {
    reaction: 'Fe³⁺(aq) + SCN⁻(aq) ↔ FeSCN²⁺(aq)',
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
      'Blanda sett í 5 tilraunaglös (glas 1 = viðmið)',
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
        good: 'Skilgreining á efnajafnvægi, Le Chatelier lögmál ÚTSKÝRT (ekki bara nefnt) með dæmum um HVERNIG áhrifaþættir (styrkur, hitastig, þrýstingur) breyta jafnvægi, ALMENNUR texti með almennum dæmum (ekki lýsing á litunum eða niðurstöðum ÚR ÞESSARI tilraun). Orðalag má vera daglegt.',
        needsImprovement: 'Nefnir þætti en ÚTSKÝRIR EKKI hvernig þeir virka, eða hefur of miklar tilvísanir í tiltekna tilraun (t.d. liti efna í ÞESSARI tilraun)',
        unsatisfactory: 'Vantar skilgreiningu á efnajafnvægi eða Le Chatelier útskýringu, eða bara telur upp þætti án þess að útskýra',
      },
      specialNote: 'CRITICAL DISTINCTION - Check for DEPTH: (1) GOOD: "Ef við bætum við efni A, þá færist hvarfið til vinstri til að minnka A" (explains HOW with example). (2) BAD: "Þættirnir eru styrkur, hitastig og þrýstingur" (just lists, doesn\'t explain). (3) Theory must use GENERAL examples (A+B↔C) not specific colors/observations from THIS experiment. (4) DEDUCT if theory includes: "Fe³⁺ er ljósgult", "verður rautt", or other specific observations. (5) Kc equation optional if not emphasized. (6) Colloquial language OK if correct.',
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
        good: 'Vísar í ákveðinn vinnuseðil (t.d. "Jafnvægi í efnahvörfum" eða "Jafnvægi í hvörfum") OG gefur stutta lýsingu. ENGIR útreikningar - þeir tilheyra AÐEINS Niðurstöðukafla.',
        needsImprovement: 'Vinnuseðilsvísun of almenn ("samkvæmt vinnuseðli" án nafns), eða hefur EINHVERJA útreikninga hér',
        unsatisfactory: 'Vantar vinnuseðilsvísun, eða hefur ALLA útreikninga í Framkvæmd í stað Niðurstöður (alvarlegt skipulagsvilla)',
      },
      specialNote: 'STRICT CHECK - Content Location: (1) Accept worksheet name variations: "Jafnvægi í efnahvörfum", "Jafnvægi í hvörfum", "sýnitilraun Jafnvægi". (2) CRITICAL: If you see mólstyrk calculations (M = mól/L), mass calculations, or ANY numerical chemistry work in Framkvæmd section, this is WRONG - calculations belong ONLY in Niðurstöður. Deduct points. (3) Brief procedure description is good. (4) This is STRUCTURAL requirement, not style.',
    },
    {
      id: 'nidurstodur',
      name: 'Niðurstöður',
      description: 'All calculations, observations, answers to worksheet questions',
      maxPoints: 10.5,
      criteria: {
        good: 'Allir þrír útreikningar HÉRNA í Niðurstöðum (KSCN, Fe(NO₃)₃ með kristallvatni, AgNO₃), ALLAR 5 tilraunir skráðar með fullbúnum Le Chatelier útskýringum, greining á inn/útvermni, engin tóm bil. Orðalag má vera daglegt ef rétt.',
        needsImprovement: 'Flestar niðurstöður til staðar en vantar 1-2 útskýringar, eða útskýringar eru ófullnægjandi',
        unsatisfactory: 'Vantar útreikninga (þeir eru kannski í röngum kafla?), eða vantar margar útskýringar á tilraunum, eða hefur bara lýsingu án greiningar',
      },
      specialNote: 'CHECK COMPLETENESS: (1) All 3 calculations must be HERE in Niðurstöður (not in Framkvæmd). (2) All 5 test tubes must have: observation + Le Chatelier explanation + direction of shift. (3) Must determine exo/endothermic. (4) Check for blank spaces or incomplete descriptions - deduct if present. (5) LANGUAGE: Accept "hvarfið vill laga", "þarf að bæta við" if concept correct. (6) Must have ANALYSIS not just description - "liturinn breyttist" is not enough, must explain WHY using Le Chatelier.',
    },
    {
      id: 'lokaord',
      name: 'Lokaorð',
      description: 'Summary with connection to theory and discussion of uncertainty',
      maxPoints: 4.5,
      criteria: {
        good: 'Samantekt tengir við Le Chatelier, UMRÆÐA um óvissu/skekkjur, SAMHENGANDI (ekki endurtaka sama aftur og aftur), hnitmiðað',
        needsImprovement: 'Tengsl við fræði til staðar en vantar umræðu um óvissu, eða smá óþarfa endurtekning',
        unsatisfactory: 'SAMHENGISLAUS (hoppar milli hugmynda), mikil endurtekning á sömu setningum, vantar umræðu um óvissu, eða tengist ekki fræðum',
      },
      specialNote: 'CHECK FOR: (1) UNCERTAINTY discussion required (measurement errors, or "errors were minimal"). (2) COHERENCE: Ideas should flow logically. (3) AVOID REPETITION: If same concept/phrase repeated 3+ times, deduct points. Example of BAD: mentioning "Le Chatelier" 5 times in one paragraph. (4) Should be concise summary, not rambling. (5) Colloquial language OK if clear. (6) Must connect results to theory.',
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
      specialNote: 'BINARY CHECK: Signature must be present at BOTTOM of report. This is simple yes/no - either it\'s there or it isn\'t. Check if student name appears after conclusion section. If missing entirely, give 0 points.',
    },
    {
      id: 'samhengi',
      name: 'Heildarsamhengi',
      description: 'Overall coherence between sections',
      maxPoints: 1.5,
      criteria: {
        good: 'Kaflar tengist saman, skýrslan er FULLBÚIN (engin tóm bil eða ófullgerðar setningar), samhengandi og yfirlesin. Orðalag má vera daglegt.',
        needsImprovement: 'Kaflar tengist ekki vel, eða virðist ekki vera lesin yfir, eða smá ófullgerðir hluti',
        unsatisfactory: 'Mjög lítið samhengi, virðist ófullbúin með tómum bilum eða vantar stóra kafla, eða mótsagnir',
      },
      specialNote: 'Check for: (1) COMPLETENESS: Are there blank spaces ("__") or missing sections? (2) COHERENCE: Do sections flow logically? (3) REVIEW: Does it seem proofread? (4) Accept informal but correct language. (5) Deduct if report seems incomplete or has obvious gaps. This is about STRUCTURE not STYLE.',
    },
  ],
  gradeScale: ['10', '9', '8', '7', '6', '5', '4', '3', '2', '1', '0'],
};
