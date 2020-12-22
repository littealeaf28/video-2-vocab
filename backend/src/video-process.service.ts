import { HttpException, Injectable } from '@nestjs/common'
import * as Ffmpeg from 'fluent-ffmpeg'
import { promises as fsPromises } from 'fs'
import { SpeechClient } from '@google-cloud/speech/build/src'

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
          resolve(`.${fileName}.flac`)
        })
        .save(`.${fileName}.flac`)
    })
  }

  // TODO: Figure out how to pass language option as well
  async speechToText(audioFilePath: string): Promise<void> {
    const audio = await fsPromises.readFile(audioFilePath)
    const audioData = audio.toString('base64')

    const client = new SpeechClient()
    // TODO: Figure out how to pass audio through storage - can't just submit the audio data. There's too much
    const res = await client.longRunningRecognize({
      config: {
        encoding: 'FLAC',
        sampleRateHertz: 16000,
        languageCode: 'zh'
      },
      audio: {
        content: audioData
      }
    })
    console.log(res)
    // const id = await client.getProjectId()
    // console.log(id)
  }
}
