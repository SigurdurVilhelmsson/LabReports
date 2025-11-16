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
        good: 'Skilgreining á efnajafnvægi, Le Chatelier lögmál útskýrt, umfjöllun um þætti sem hafa áhrif (styrkur, hitastig, þrýstingur), jöfnur númeraðar',
        needsImprovement: 'Fræðin til staðar en vantar annað hvort skilgreiningu, lögmálið eða umfjöllun um áhrifaþætti',
        unsatisfactory: 'Vantar mikilvæga fræðilega þætti eða er mjög ófullkomið',
      },
      specialNote: 'Must include: (1) definition of chemical equilibrium, (2) Le Chatelier\'s principle explanation, (3) factors affecting equilibrium (concentration, temperature, pressure)',
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
        good: 'Vísar í vinnuseðilinn "Jafnvægi í efnahvörfum" OG gefur stutta lýsingu (1-2 setningar) á aðalþáttum tilraunarinnar - þetta er RÉTT!',
        needsImprovement: 'Annaðhvort vinnuseðilsvísun eða stuttlýsing vantar',
        unsatisfactory: 'Vantar eða of ítarleg endurskrift á vinnuseðli (nemendur eiga EKKI að skrifa allt út)',
      },
      specialNote: 'IMPORTANT: Students should reference the specific worksheet "Jafnvægi í efnahvörfum" (or similar specific reference), NOT just write out detailed procedures. Referencing worksheet + brief summary is GOOD practice.',
    },
    {
      id: 'nidurstodur',
      name: 'Niðurstöður',
      description: 'All calculations, observations, answers to worksheet questions',
      maxPoints: 10.5,
      criteria: {
        good: 'Allir þrír útreikningar réttir (KSCN, Fe(NO₃)₃ með kristallvatni, AgNO₃), allar athuganir skráðar (litabreytingar), útskýringar með Le Chatelier fyrir ALLAR 5 tilraunir, greining á átt jafnvægis, útskýring á hvort hvarfið sé inn- eða útvermið, öll svör við spurningum í vinnuseðli',
        needsImprovement: 'Flestar niðurstöður til staðar: útreikningar að mestu réttir, flestar athuganir skráðar, en vantar 1-2 útskýringar eða svör',
        unsatisfactory: 'Vantar marga útreikninga, athuganir eða útskýringar; útskýringar ekki tengdar við Le Chatelier',
      },
      specialNote: 'This section must include: (1) All three solution calculations (100 mL each, check Fe(NO₃)₃ accounts for crystal water), (2) Observations and color changes for all 5 test tubes, (3) Le Chatelier explanations for each test showing direction of equilibrium shift, (4) Determination of exo/endothermic nature from test 5, (5) Answers to ALL questions on the worksheet',
    },
    {
      id: 'lokaord',
      name: 'Lokaorð',
      description: 'Summary with connection to theory',
      maxPoints: 4.5,
      criteria: {
        good: 'Góð samantekt á helstu niðurstöðum, tengsl við fræðikafla eru skýr, sýnir að niðurstöður samræmast Le Chatelier lögmálinu',
        needsImprovement: 'Samantekt til staðar en tengsl við fræðin gætu verið skýrari',
        unsatisfactory: 'Mjög veik samantekt, vantar tengsl við fræðikafla eða vantar alveg',
      },
      specialNote: 'Conclusions must connect back to theory section and show that results align with Le Chatelier\'s principle',
    },
    {
      id: 'undirskrift',
      name: 'Undirskrift',
      description: 'Student signature present',
      maxPoints: 1.5,
      criteria: {
        good: 'Undirskrift til staðar',
        unsatisfactory: 'Vantar undirskrift',
      },
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

