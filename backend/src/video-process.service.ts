import { HttpException, Injectable } from '@nestjs/common'
import * as Ffmpeg from 'fluent-ffmpeg'
import { rename } from 'fs'
import { rejects } from 'assert'

const pathToFfmpeg = require('ffmpeg-static')

@Injectable()
export class VideoProcessService {
  // addFileExtension(filePath: string): Promise<string> {
  //   return new Promise ((resolve, reject) => {
  //     const newFilePath = `${filePath}.mp4`
  //     rename(filePath, newFilePath, (err) => {
  //       if (err) { reject(err) }
  //       else resolve(newFilePath)
  //     })
  //   })
  // }

  async extractSoundFromVideo(filePath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const [_, fileName] = filePath.split('.')

      Ffmpeg(filePath)
        .setFfmpegPath(pathToFfmpeg)
        .noVideo()
        .on('error', (err) => {
          console.log(err.message)
          reject()
        })
        .on('end', () => {
          resolve(`.${fileName}`)
        })
        .save(`.${fileName}.mp3`)
    })
  }
}
