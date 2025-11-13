import { ExperimentConfigs } from '@/types';

// Experiment configurations - Easy to maintain and extend
export const experimentConfigs: ExperimentConfigs = {
  jafnvaegi: {
    id: 'jafnvaegi',
    title: 'Jafnvægi í efnahvörfum',
    year: 3,
    worksheet: {
      reaction: 'Fe³⁺(aq) + SCN⁻(aq) ↔ FeSCN²⁺(aq)',
      materials: [
        'KSCN(s)',
        '0,002M KSCN lausn',
        '0,2 M Fe(NO₃)₃',
        '0,1 M AgNO₃ lausn'
      ],
      equipment: [
        '2 bikarglös',
        '6 tilraunaglös',
        'glasastandur',
        'dropateljarar'
      ],
      steps: [
        'Búa til 100 mL af þremur lausnum með réttum mólstyrk',
        'Skoða KSCN lausn (litur og jónir)',
        'Blanda Fe(NO₃)₃ við KSCN - sjá litabreytingu',
        'Prófa 5 tilraunir með mismunandi breytingum:',
        '  1. Viðmið',
        '  2. Bæta við föstu KSCN',
        '  3. Bæta við Fe(NO₃)₃ lausn',
        '  4. Bæta við AgNO₃ lausn',
        '  5. Hita í 50°C vatni'
      ]
    },
    sections: [
      {
        id: 'tilgangur',
        name: 'Tilgangur',
        description: '1-2 sentences about goals',
        maxPoints: 3,
        criteria: {
          good: 'Skýr lýsing á markmiðum tilraunarinnar',
          needsImprovement: 'Tilgangur til staðar en vantar smáatriði',
          unsatisfactory: 'Mjög óljós eða vantar alveg',
        },
      },
      {
        id: 'fraedi',
        name: 'Fræðikafli',
        description: "Definitions, Le Chatelier's law, numbered equations",
        maxPoints: 7.5,
        criteria: {
          good: 'Skilgreiningar, Le Chatelier lögmál og númeraðar jöfnur',
          needsImprovement: 'Fræðin til staðar en eitthvað vantar',
          unsatisfactory: 'Vantar mikilvæga fræðilega þætti',
        },
      },
      {
        id: 'taeki',
        name: 'Tæki og efni',
        description: 'Complete list of equipment and materials',
        maxPoints: 1.5,
        criteria: {
          good: 'Fullkominn listi yfir tæki og efni',
          needsImprovement: 'Listi til staðar en eitthvað vantar',
          unsatisfactory: 'Mjög ófullkominn eða vantar',
        },
      },
      {
        id: 'framkvamd',
        name: 'Framkvæmd',
        description: 'Should reference worksheet ("Sjá vinnuseðil") + brief 1-2 sentence description',
        maxPoints: 3,
        criteria: {
          good: 'Vísar í vinnuseðil og stuttur lýsing á framkvæmd - þetta er rétt!',
          needsImprovement: 'Annaðhvort vinnuseðilsvísun eða lýsing vantar',
          unsatisfactory: 'Vantar eða of ítarleg (nemendur eiga EKKI að skrifa ítarlegar leiðbeiningar)',
        },
        specialNote: 'Students should NOT write detailed procedures - referencing worksheet is GOOD!',
      },
      {
        id: 'nidurstodur',
        name: 'Niðurstöður',
        description: 'All calculations (KSCN, Fe(NO₃)₃, AgNO₃), observations, explanations',
        maxPoints: 7.5,
        criteria: {
          good: 'Allar útreikningar, athuganir og skýringar til staðar',
          needsImprovement: 'Flest til staðar en vantar smáatriði',
          unsatisfactory: 'Vantar mikilvæga útreikninga eða skýringar',
        },
      },
      {
        id: 'lokaord',
        name: 'Lokaorð',
        description: 'Summary, connection to theory',
        maxPoints: 6,
        criteria: {
          good: 'Gott samantekt og tengsl við fræðin',
          needsImprovement: 'Samantekt til staðar en gæti verið betri',
          unsatisfactory: 'Mjög veik samantekt eða vantar',
        },
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
    ],
    gradeScale: ['10', '8', '5', '0'],
  },
  // Additional experiments can be easily added here
};

// Helper function to get all experiments as an array
export const getExperiments = () => Object.values(experimentConfigs);

// Helper function to get a specific experiment by ID
export const getExperiment = (id: string) => experimentConfigs[id];
