import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { VideoProcessController } from './video-process/video-process.controller';
import { VideoProcessService } from './video-process.service';

@Module({
  imports: [],
  controllers: [VideoProcessController],
  providers: [AppService, VideoProcessService],
})
export class AppModule {}
