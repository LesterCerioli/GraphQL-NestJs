import { AbstractGraphQLDriver } from '@nestjs/graphql';
import { FastifyInstance, FastifyLoggerInstance } from 'fastify';
import { IncomingMessage, Server, ServerResponse } from 'http';
import mercurius from 'mercurius';
import { MercuriusDriverConfig } from '../interfaces/mercurius-driver-config.interface';
import { registerMercuriusPlugins } from '../utils/register-mercurius-plugins.util';

export class MercuriusGatewayDriver extends AbstractGraphQLDriver<MercuriusDriverConfig> {
  get instance(): FastifyInstance<
    Server,
    IncomingMessage,
    ServerResponse,
    FastifyLoggerInstance
  > {
    return this.httpAdapterHost?.httpAdapter?.getInstance?.();
  }

  public async start(options: MercuriusDriverConfig) {
    const httpAdapter = this.httpAdapterHost.httpAdapter;
    const platformName = httpAdapter.getType();

    if (platformName !== 'fastify') {
      throw new Error(`No support for current HttpAdapter: ${platformName}`);
    }

    const app = httpAdapter.getInstance<FastifyInstance>();
    const plugins = options.plugins;
    delete options.plugins;
    await app.register(mercurius, {
      ...options,
    });
    await registerMercuriusPlugins(app, plugins);
  }

  public async stop(): Promise<void> {}
}
