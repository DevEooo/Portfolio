import { useState } from 'react'
// import Transition from './components/Transition.tsx'
import Header from './sections/Header.tsx'
import Footer from './sections/Footer.tsx'
import Cursor from './components/Cursor.tsx'
import Preloader from './sections/Preloader.tsx'
import Hero from './sections/Hero.tsx'
import Marquee from './components/Marquee.tsx'
import Greeting from './sections/Greeting.tsx'
import SelectedWork from './sections/SelectedWork.tsx'
import Expertise from './sections/Expertise.tsx'
import { preloaderContent } from './content/Preloader.ts'
import { headerContent } from './content/Header.ts'
import { heroContent } from './content/Hero.ts'
import { marqueeContent } from './content/Marquee.ts'
import { greetingContent } from './content/Greeting.ts'
import { selectedWorkContent } from './content/SelectedWork.ts'
import { expertiseContent } from './content/Expertise.ts'
import { footerContent } from './content/Footer.ts'

function App() {
  const [isPreloading, setIsPreloading] = useState(true)

  return(
    <>
      <Cursor/>
      <Header content={headerContent} inert={isPreloading} revealed={!isPreloading}/>
      <main id="main" tabIndex={-1} inert={isPreloading}>
        <Hero content={heroContent} revealed={!isPreloading}/>
        <Marquee content={marqueeContent}/>
        <Greeting content={greetingContent}/>
        <SelectedWork content={selectedWorkContent}/>
        <Expertise content={expertiseContent}/>
      </main>
      <Footer content={footerContent} inert={isPreloading}/>

      {isPreloading && (
        <Preloader content={preloaderContent} onComplete={() => setIsPreloading(false)}/>
      )}
    </>
  )
}

export default App
