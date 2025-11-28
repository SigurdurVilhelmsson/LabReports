import { ExperimentConfigs } from '@/types';
import { jafnvaegi } from './jafnvaegi';

/**
 * Experiment Configurations
 *
 * Each experiment is defined in its own file for easier maintenance.
 * To add a new experiment:
 * 1. Create a new file: experiments/[experiment-id].ts
 * 2. Export the experiment config (see jafnvaegi.ts as example)
 * 3. Import and add it to experimentConfigs below
 */
export const experimentConfigs: ExperimentConfigs = {
  jafnvaegi,
  syra_basi_gas,
  // Add new experiments here:
  // surustig,
  // varmagildi,
};

/**
 * Helper function to get all experiments as an array
 */
export const getExperiments = () => Object.values(experimentConfigs);

/**
 * Helper function to get a specific experiment by ID
 */
export const getExperiment = (id: string) => experimentConfigs[id];
