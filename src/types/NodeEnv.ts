import { Constants } from '../constants';

export const NodeEnvs = [
  Constants.NODE_ENVS.PRODUCTION,
  Constants.NODE_ENVS.DEVELOPMENT
] as const;

export type NodeEnv = typeof NodeEnvs[number];
