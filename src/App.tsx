import React from 'react'
import VideoPlayer from './VideoPlayer'

const App = () => {
  return (
    <div className='w-screen h-screen flex flex-col gap-20 justify-center items-center'>
        <h1 className='font-bold text-4xl'>Custom Video Player</h1>
        <VideoPlayer/>
    </div>
  )
}

export default App