import { ExperimentConfig } from '@/types';

/**
 * Jafnvægi í efnahvörfum (Chemical Equilibrium)
 * 3rd year chemistry experiment - CORRECTED VERSION
 *
 * This experiment explores Le Chatelier's principle by observing
 * how an equilibrium system (Fe³⁺ + SCN⁻ ↔ FeSCN²⁺) responds to
 * changes in concentration and temperature.
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
        good: 'Skilgreining á efnajafnvægi, Le Chatelier lögmál útskýrt með SKÝRUM dæmum um hvernig áhrifaþættir (styrkur, hitastig, þrýstingur) hafa áhrif á jafnvægi, ALMENNUR texti (ekki tilteknar niðurstöður úr þessari tilraun). Kc jafna er valkvæð ef kennari lagði ekki áherslu á hana.',
        needsImprovement: 'Fræðin til staðar en útskýringar á áhrifaþáttum gætu verið skýrari, eða of miklar tilvísanir í tilraunina sjálfa',
        unsatisfactory: 'Vantar mikilvæga skilgreiningu á efnajafnvægi eða Le Chatelier lögmál, eða útskýrir ekki hvernig áhrifaþættir virka',
      },
      specialNote: 'IMPORTANT: (1) Must define equilibrium and explain Le Chatelier\'s principle. (2) Must explain how concentration, temperature, and pressure affect equilibrium - examples are sufficient, doesn\'t need to be in separate paragraphs. (3) Kc equation is OPTIONAL unless teacher specifically emphasized it - don\'t deduct heavily if missing. (4) Theory should be general, not specific to this experiment. (5) Colloquial phrases like "hvarfið vill laga breytinguna" are ACCEPTABLE if conceptually correct - focus on understanding, not perfect formal terminology.',
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
        good: 'Vísar í ákveðinn vinnuseðil (t.d. "Jafnvægi í efnahvörfum" eða "Jafnvægi í hvörfum") OG gefur stutta lýsingu á tilrauninni. Útreikningar tilheyra Niðurstöðukafla.',
        needsImprovement: 'Vinnuseðilsvísun of almenn eða vantar, eða of mikið af smáatriðum',
        unsatisfactory: 'Vantar vinnuseðilsvísun eða gerir endurskrift á öllum skrefum í stað þess að vísa í vinnuseðil',
      },
      specialNote: 'IMPORTANT: (1) Accept variations of worksheet name: "Jafnvægi í efnahvörfum", "Jafnvægi í hvörfum", "sýnitilraun" with context. (2) Brief procedure summary (1-2 sentences) is GOOD. (3) If ALL calculations appear in Niðurstöður section (as they should), this is GOOD - only deduct if calculations are mixed into procedure description here.',
    },
    {
      id: 'nidurstodur',
      name: 'Niðurstöður',
      description: 'All calculations, observations, answers to worksheet questions',
      maxPoints: 10.5,
      criteria: {
        good: 'Allir þrír útreikningar réttir (KSCN, Fe(NO₃)₃ með kristallvatni, AgNO₃), allar athuganir skráðar (litabreytingar), útskýringar fyrir ALLAR 5 tilraunir með Le Chatelier, greining á hvort hvarfið sé inn- eða útvermið, öll svör við spurningum. Orðalag má vera daglegt ef hugtökin eru rétt (t.d. "hvarfið vill laga" er ásættanlegt).',
        needsImprovement: 'Flestar niðurstöður til staðar: útreikningar að mestu réttir, flestar athuganir skráðar, en vantar 1-2 útskýringar eða vantar greiningu á inn/útvermni',
        unsatisfactory: 'Vantar marga útreikninga, athuganir eða útskýringar; útskýringar ekki tengdar við Le Chatelier eða RANGAR',
      },
      specialNote: 'FOCUS ON CORRECTNESS, NOT FORMALITY: (1) All three calculations must be present and correct (check Fe(NO₃)₃ includes crystal water). (2) All 5 test tube observations and explanations must be documented. (3) Must determine if reaction is endothermic or exothermic. (4) ACCEPT colloquial language like "hvarfið vill laga breytinguna", "þarf að bæta við", "reynir að laga" if the CONCEPT is correct. Only deduct if explanation is actually WRONG or missing key Le Chatelier connection. Formal scientific terminology is nice to have but NOT required for "Gott" rating.',
    },
    {
      id: 'lokaord',
      name: 'Lokaorð',
      description: 'Summary with connection to theory and discussion of uncertainty',
      maxPoints: 4.5,
      criteria: {
        good: 'Góð samantekt á helstu niðurstöðum, tengsl við Le Chatelier lögmál eru skýr, UMRÆÐA um óvissu eða skekkjur (hvort þær hafi áhrif á niðurstöður), samhengandi texti',
        needsImprovement: 'Samantekt til staðar og tengir við fræðikafla, en VANTAR umræðu um óvissu/skekkjur',
        unsatisfactory: 'Mjög veik samantekt sem tengist ekki við fræðikafla, VANTAR umræðu um óvissu, eða mjög samhengislaus',
      },
      specialNote: 'KEY REQUIREMENT: Must include discussion of UNCERTAINTY/ERROR ANALYSIS (óvissa) - for example: measurement errors, temperature control, concentration precision, or statement that errors were minimal and didn\'t affect conclusions. This is critical for "Gott" rating. Colloquial language is acceptable if concepts are clear. Conclusions should connect results back to Le Chatelier\'s principle.',
    },
    {
      id: 'undirskrift',
      name: 'Undirskrift',
      description: 'Student signature present at bottom of report',
      maxPoints: 1.5,
      criteria: {
        good: 'Undirskrift til staðar NEÐST í skýrslu',
        unsatisfactory: 'Vantar undirskrift, eða er ekki neðst í skýrslu',
      },
      specialNote: 'Signature must be at the BOTTOM of the report, after all other sections (especially after Lokaorð/Umræða)',
    },
    {
      id: 'samhengi',
      name: 'Heildarsamhengi',
      description: 'Overall coherence between sections',
      maxPoints: 1.5,
      criteria: {
        good: 'Góð tengsl milli kafla, skýrslan er samhengandi og lítur út fyrir að vera lesið yfir. Hugtök rétt notuð (formleg eða óformleg).',
        needsImprovement: 'Þokkalegt samhengi en kaflar tengist ekki vel saman',
        unsatisfactory: 'Lítið samhengi milli kafla, virðist ekki lesið yfir, eða miklar mótsagnir',
      },
      specialNote: 'Focus on COHERENCE and CORRECTNESS, not formal terminology. Report should flow logically between sections. Colloquial but correct language should NOT be penalized here. Only deduct if sections contradict each other or report seems unreviewed.',
    },
  ],
  gradeScale: ['10', '9', '8', '7', '6', '5', '4', '3', '2', '1', '0'],
};
