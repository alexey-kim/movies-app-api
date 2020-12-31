import { IsIn, IsInt, IsPositive } from 'class-validator';
import { config, DotenvConfigOutput } from 'dotenv';
import { injectable } from 'inversify';
import { Constants } from '../constants';
import { InternalError } from '../errors/InternalError';
import { errorToLoggingJSON } from '../serialisation/utils/serialisationUtils';
import { KeyValueStrings } from '../types/KeyValueStrings';
import { NodeEnv, NodeEnvs } from '../types/NodeEnv';
import { equalsAnyCase } from '../utils/checkUtils';
import { getAbsolutePath } from '../utils/fileUtils';
import { toInt } from '../utils/stringUtils';
import { BaseValidatable } from '../validation/BaseValidatable';
import { withValidation } from '../validation/utils/validationUtils';
import { IConfig } from './interfaces/IConfig';

@injectable()
export class DotEnvConfig extends BaseValidatable implements IConfig {

  private constructor(data: KeyValueStrings) {
    super();
    this.NODE_ENV = NodeEnvs.find(nodeEnv => equalsAnyCase(nodeEnv, data.NODE_ENV)) ?? Constants.NODE_ENVS.PRODUCTION;
    this.APP_PORT = toInt(data.APP_PORT) ?? toInt(data.PORT) ?? Constants.DEFAULTS.APP_PORT;
  }

  public static async init(dotEnvRelativeFilePath: string): Promise<DotEnvConfig> {

    const dotEnvFilePath: string = getAbsolutePath(dotEnvRelativeFilePath);

    try {
      const dotEnvConfigOutput: DotenvConfigOutput = config({ path: dotEnvFilePath });
      // Do not throw an exception if .env file does not exist, e.g. if all environment variables are explicitly provided to the process
      if (dotEnvConfigOutput.error instanceof Error && !dotEnvConfigOutput.error.message.startsWith('ENOENT')) {
        throw dotEnvConfigOutput.error;
      }
      const dotEnvConfigData: KeyValueStrings = dotEnvConfigOutput.parsed ?? {};
      // Merge process.env last so that explicitly provided environment variables take precedence over .env file
      const dotEnvConfig: DotEnvConfig = new DotEnvConfig({ ...dotEnvConfigData, ...process.env } as KeyValueStrings);
      return await withValidation(dotEnvConfig, false);
    } catch (error) {
      console.error(JSON.stringify(errorToLoggingJSON(error), undefined, 2)); // tslint:disable-line: ban no-console
      throw new InternalError(`Config from [${dotEnvFilePath}] file or process.env is invalid`);
    }
  }

  @IsIn([...NodeEnvs])
  public readonly NODE_ENV: NodeEnv;

  @IsInt()
  @IsPositive()
  public readonly APP_PORT: number;
}
