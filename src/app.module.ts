import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from './shared/config.service';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [
    SharedModule,
    TypeOrmModule.forRootAsync({
      imports: [ SharedModule ],
      inject: [ ConfigService ],
      useFactory: (config: ConfigService) => {
        const ssl = config.get('USE_SSL') === 'true'
          ? { rejectUnauthorized: false }
          : false;

        const url = config.get('DATABASE_URL') ?? '';

        return {
          type: 'postgres',
          entities: [ __dirname + '/**/**.model{.ts,.js}' ],
          url, ssl,
          extra: { max: 5 },
        };
      },
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
