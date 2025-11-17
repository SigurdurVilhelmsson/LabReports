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
        good: 'Skilgreining á efnajafnvægi, Le Chatelier lögmál útskýrt, HVER áhrifaþáttur (styrkur, hitastig, þrýstingur) útskýrður fyrir sig, Kc jafna rétt sett upp og númeruð, ALMENNUR texti (ekki tilteknar niðurstöður úr þessari tilraun)',
        needsImprovement: 'Fræðin til staðar en vantar umfjöllun um einstaka þætti fyrir sig, eða Kc jafna ekki vel sett upp, eða of miklar tilvísanir í tilraunina sjálfa',
        unsatisfactory: 'Vantar mikilvæga fræðilega þætti, Kc jafna vantar eða röng, eða hefur niðurstöður tilraunar í fræðikafla',
      },
      specialNote: 'CRITICAL CHECKS: (1) Each factor (concentration, temperature, pressure) must be discussed SEPARATELY with clear explanation. (2) Kc equation must be properly formatted with correct mathematical notation (e.g., Kc = [C]^c[D]^d / [A]^a[B]^b). (3) Theory section must contain ONLY general theory - deduct points if specific observations, color changes, or results from THIS experiment appear here. Theory should work for ANY equilibrium, not just Fe³⁺/SCN⁻.',
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
        good: 'Vísar í ÁKVEÐINN vinnuseðil (t.d. "Jafnvægi í efnahvörfum" með árganga) OG gefur stutta lýsingu (1-2 setningar) á aðalþáttum tilraunarinnar. ENGIR útreikningar hér - þeir eiga heima í Niðurstöðukafla!',
        needsImprovement: 'Annaðhvort vinnuseðilsvísun of almenn ("samkvæmt vinnuseðli") eða stuttlýsing vantar, eða hefur útreikningar sem eiga að vera í Niðurstöðum',
        unsatisfactory: 'Vantar vinnuseðilsvísun eða of ítarleg endurskrift á vinnuseðli, eða fullt af útreikningum sem eiga ekki að vera hér',
      },
      specialNote: 'IMPORTANT: (1) Students must reference SPECIFIC worksheet name, not just "vinnuseðill" or "worksheet". (2) Brief procedure summary (1-2 sentences) is good. (3) DEDUCT POINTS if calculations appear here - all calculations belong in Niðurstöður section. Check for molarity calculations, mass calculations, or any numerical work.',
    },
    {
      id: 'nidurstodur',
      name: 'Niðurstöður',
      description: 'All calculations, observations, answers to worksheet questions',
      maxPoints: 10.5,
      criteria: {
        good: 'Allir þrír útreikningar réttir (KSCN, Fe(NO₃)₃ með kristallvatni, AgNO₃), allar athuganir skráðar (litabreytingar), útskýringar með Le Chatelier fyrir ALLAR 5 tilraunir með VIÐEIGANDI orðalagi (t.d. "hvarfið færist til hægri/vinstri", "myndast meira af X", "jafnvægið hliðrast"), greining á átt jafnvægis, útskýring á hvort hvarfið sé inn- eða útvermið, öll svör við spurningum í vinnuseðli',
        needsImprovement: 'Flestar niðurstöður til staðar: útreikningar að mestu réttir, flestar athuganir skráðar, en vantar 1-2 útskýringar eða svör, eða orðalag gæti verið vísindalegra (forðast "hvarfið vill laga", "þarf að bæta við")',
        unsatisfactory: 'Vantar marga útreikninga, athuganir eða útskýringar; útskýringar ekki tengdar við Le Chatelier; óviðeigandi orðalag (of mannlegt/óvísindalegt)',
      },
      specialNote: 'TERMINOLOGY CHECK: When describing equilibrium shifts, students should use proper scientific language: GOOD phrases include "hvarfið færist til hægri/vinstri" (reaction shifts right/left), "jafnvægið hliðrast" (equilibrium shifts), "myndast meira af [efni]" (more of [compound] forms), "styrkur [efnis] eykst/minnkar" (concentration increases/decreases). AVOID anthropomorphic phrases like "hvarfið vill laga breytinguna" (reaction wants to fix the change) or "þarf að bæta við" (needs to add). Check that all 5 test tubes have proper explanations with scientific terminology.',
    },
    {
      id: 'lokaord',
      name: 'Lokaorð',
      description: 'Summary with connection to theory',
      maxPoints: 4.5,
      criteria: {
        good: 'Góð samantekt á helstu niðurstöðum með NÝJUM innsýnum (ekki bara endurtekning), tengsl við fræðikafla eru skýr, sýnir að niðurstöður samræmast Le Chatelier lögmálinu, SAMHENGANDI texti',
        needsImprovement: 'Samantekt til staðar en tengsl við fræðin gætu verið skýrari, eða smá endurtekning á því sem þegar hefur verið sagt, eða samhengið gæti verið betra',
        unsatisfactory: 'Mjög veik samantekt, vantar tengsl við fræðikafla, SAMHENGISLAUS (hoppar milli hugmynda), eða bara endurtekur sama og í Niðurstöðum án nýrra hugsana',
      },
      specialNote: 'Conclusions must: (1) Connect back to theory section showing results align with Le Chatelier\'s principle, (2) Provide NEW insights or broader context - NOT just repeat what was already stated in Results, (3) Be COHERENT - ideas should flow logically without jumping around or repeating the same point multiple times. Deduct points for "samhengislaust" (incoherent/disconnected) writing or excessive repetition ("þvæla um sama hlutinn aftur").',
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
        good: 'Góð tengsl milli kafla, lítur út fyrir að nemandi hafi lesið yfir skýrsluna',
        needsImprovement: 'Þokkalegt samhengi en gæti verið betra',
        unsatisfactory: 'Lítið samhengi milli kafla, virðist ekki lesið yfir',
      },
      specialNote: 'Check if report sections flow logically and reference each other appropriately',
    },
  ],
  gradeScale: ['10', '9', '8', '7', '6', '5', '4', '3', '2', '1', '0'],
};
