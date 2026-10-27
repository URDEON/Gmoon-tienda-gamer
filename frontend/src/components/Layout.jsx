import { useLayoutEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Contacto from './Contacto'
import Footer from './Footer'

function Layout() {
  const { pathname, hash } = useLocation()

  useLayoutEffect(() => {
    if (hash) {
      document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView()
      return
    }

    window.scrollTo(0, 0)
  }, [pathname, hash])

  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Contacto />
      <Footer />
    </>
  )
}

export default Layout