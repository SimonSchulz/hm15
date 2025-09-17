import { Module, OnModuleInit } from '@nestjs/common';
import { TestingController } from './testing.controller';

@Module({
  imports: [],
  controllers: [TestingController],
})
export class TestingModule implements OnModuleInit {
  onModuleInit() {
    console.log('✅ TestingModule initialized');
  }
}
