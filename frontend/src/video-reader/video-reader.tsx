import axios from 'axios'
import React, { useState } from 'react'
import './video-reader.css'

export function VideoReader() {
  const [videoFile, setVideoFile] = useState<File | null> (null)
  const [video, setVideo] = useState<string | ArrayBuffer | null> (null)

  const getVideo = (e: any) => {
    const reader = new FileReader()
    const _videoFile: File = e.target.files[0]

    reader.readAsDataURL(_videoFile)
    setVideoFile(_videoFile)

    reader.addEventListener('load', () => {
      setVideo(reader.result)
    })
  }

  const submitVideo = async (e: any) => {
    e.preventDefault()

    if (videoFile) {
      const videoFormData = new FormData()
      videoFormData.append('video', videoFile, videoFile.name)
      console.log(videoFile)
      const res = await axios.post('http://localhost:3001/video-process', videoFormData)
      console.log(res.data)
    }
    // else show error
  }

  return (
    <form onSubmit={submitVideo}>
      <input type="file" accept="video/*" onChange={getVideo} required/>
      { video && <div className="video-container">
        <h1>Video Preview</h1>
        <video controls autoPlay>
          <source src={video as string}/>
        </video>
      </div> }
      <button type="submit">Submit</button>
    </form>
  )
}
