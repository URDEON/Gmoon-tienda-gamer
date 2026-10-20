import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Contacto from './Contacto'
import Footer from './Footer'

function Layout() {
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