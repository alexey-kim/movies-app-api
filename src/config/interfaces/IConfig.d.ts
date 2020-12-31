import { NodeEnv } from '../../types/NodeEnv';

export interface IConfig {
  readonly NODE_ENV: NodeEnv;
  readonly APP_PORT: number;
}
