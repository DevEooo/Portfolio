import { useState } from 'react'
// import StairsReveal from './components/common/Transition.tsx'
import SiteHeader from './components/common/SiteHeader.tsx'
import SiteFooter from './components/common/SiteFooter.tsx'
import Cursor from './components/common/Cursor.tsx'
import Preloader from './components/specific/Preloader.tsx'
import Hero from './components/specific/Hero.tsx'
import Marquee from './components/common/Marquee.tsx'
import Greeting from './components/specific/Greeting.tsx'
import SelectedWork from './components/specific/SelectedWork.tsx'
import { preloaderContent } from './data/Preloader.ts'
import { siteHeaderContent } from './data/SiteHeader.ts'
import { heroContent } from './data/Hero.ts'
import { marqueeContent } from './data/Marquee.ts'
import { greetingContent } from './data/Greeting.ts'
import { selectedWorkContent } from './data/SelectedWork.ts'
import { siteFooterContent } from './data/SiteFooter.ts'

function App() {
  const [isPreloading, setIsPreloading] = useState(true)

  return(
    <>
      <Cursor/>
      <SiteHeader content={siteHeaderContent} inert={isPreloading} revealed={!isPreloading}/>
      <main id="main" tabIndex={-1} inert={isPreloading}>
        <Hero content={heroContent} revealed={!isPreloading}/>
        <Marquee content={marqueeContent}/>
        <Greeting content={greetingContent}/>
        <SelectedWork content={selectedWorkContent}/>
      </main>
      <SiteFooter content={siteFooterContent} inert={isPreloading}/>

      {isPreloading && (
        <Preloader content={preloaderContent} onComplete={() => setIsPreloading(false)}/>
      )}
    </>
  )
}

export default App
