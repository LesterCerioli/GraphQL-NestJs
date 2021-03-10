import { Module } from '@nestjs/common';
import { GraphQLModule } from '../../lib';
import { DirectionsModule } from './directions/directions.module';
import { RecipesModule } from './recipes/recipes.module';

@Module({
  imports: [
    RecipesModule,
    DirectionsModule,
    GraphQLModule.forRoot({
      debug: false,
      installSubscriptionHandlers: true,
      autoSchemaFile: true,
    }),
    GraphQLModule.forRoot({
      debug: false,
      installSubscriptionHandlers: true,
      autoSchemaFile: true,
      path: 'not-default',
    }),
  ],
})
export class ApplicationModule {}
