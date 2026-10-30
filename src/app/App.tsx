import { useEffect } from 'react'
import { observeLayoutRefresh, refreshScrollTriggers } from '@/animations/scrollAnimations'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { About } from '@/sections/About'
import { Contact } from '@/sections/Contact'
import { Expertise } from '@/sections/Expertise'
import { FeaturedProject } from '@/sections/FeaturedProject'
import { Hero } from '@/sections/Hero'
import { Philosophy } from '@/sections/Philosophy'
import { Projects } from '@/sections/Projects'
import { Statistics } from '@/sections/Statistics'
import { AppProviders } from './providers/AppProviders'

function Page() {
  useEffect(() => {
    document.fonts?.ready.then(() => refreshScrollTriggers())
    return observeLayoutRefresh()
  }, [])

  return (
    <>
      <Header />
      <main id="main">
        <Hero />
        <Philosophy />
        <Projects />
        <FeaturedProject />
        <About />
        <Expertise />
        <Statistics />
        <Contact />
      </main>
      <Footer />
    </>
  )
}

export function App() {
  return (
    <AppProviders>
      <Page />
    </AppProviders>
  )
}