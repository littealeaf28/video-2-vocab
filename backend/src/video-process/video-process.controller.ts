import { Controller, Get, HttpException, Post, UploadedFile, UseInterceptors } from '@nestjs/common'
import { AppService } from '../app.service'
import { FileInterceptor } from '@nestjs/platform-express'
import { VideoProcessService } from '../video-process.service'
import { diskStorage } from 'multer'
import { v4 as uuid } from 'uuid'
import { extension } from 'mime-types'

@Controller('video-process')
export class VideoProcessController {
  constructor(
    private readonly appService: AppService,
    private readonly videoProcess: VideoProcessService
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post()
  @UseInterceptors(FileInterceptor('video', {
    storage: diskStorage({
      destination: function (req, file, callback) {
        callback(null, './tmp')
      },
      filename: function (req, file, callback) {
        const fileExtension = extension(file.mimetype)
        // TODO: error when extension is incorrect
        callback(null, `${uuid()}.${fileExtension}`)
      }
    })
    // storage: memoryStorage() //
  }))
  async processVideo(@UploadedFile() file): Promise<boolean | HttpException> {
    let fileName: string
    try {
      fileName = await this.videoProcess.extractSoundFromVideo(`./tmp/${file.filename}`)
      // await this.videoProcess.extractSoundFromVideo(file.buffer)
    } catch(err) {
      return new HttpException('Failed to extract audio from video', 500)
    }

    // TODO: Delete mp4

    console.log(fileName)
    return true
  }
}
