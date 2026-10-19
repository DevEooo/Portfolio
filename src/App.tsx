import { useState } from 'react'
import './App.css'
import StairsReveal from './components/common/Transition.tsx'
import Preloader from './components/specific/Preloader.tsx'
import { preloaderContent } from './data/preloader.ts'

function App() {
  const [isPreloading, setIsPreloading] = useState(true)

  return(
    <>
      <main inert={isPreloading}></main>
      <StairsReveal revealing={!isPreloading}/>
      {isPreloading && (
        <Preloader content={preloaderContent} onComplete={() => setIsPreloading(false)}/>
      )}
    </>
  )
}

export default App
