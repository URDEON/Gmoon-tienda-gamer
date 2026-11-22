import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import RutaAdmin from './components/RutaAdmin'
import RutaVendedor from './components/RutaVendedor'
import RutaCliente from './components/RutaCliente'
import Inicio from './pages/Inicio'
import Productos from './pages/Productos'
import ProductoDetalle from './pages/ProductoDetalle'
import Carrito from './pages/Carrito'
import Checkout from './pages/Checkout'
import Ofertas from './pages/Ofertas'
import ResultadoPago from './pages/ResultadoPago'
import Blog from './pages/Blog'
import IniciarSesion from './pages/IniciarSesion'
import Registrar from './pages/Registrar'
import PanelAdmin from './pages/PanelAdmin'
import PanelVendedor from './pages/PanelVendedor'
import MisCompras from './pages/MisCompras'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Inicio />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/producto/:id" element={<ProductoDetalle />} />
        <Route path="/carrito" element={<Carrito />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/pago/:estado" element={<ResultadoPago />} />
        <Route path="/ofertas" element={<Ofertas />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<Blog />} />
        <Route path="/iniciar-sesion" element={<IniciarSesion />} />
        <Route path="/registrar" element={<Registrar />} />
        <Route
          path="/admin"
          element={
            <RutaAdmin>
              <PanelAdmin />
            </RutaAdmin>
          }
        />
        <Route
          path="/vendedor"
          element={
            <RutaVendedor>
              <PanelVendedor />
            </RutaVendedor>
          }
        />
        <Route
          path="/mis-compras"
          element={
            <RutaCliente>
              <MisCompras />
            </RutaCliente>
          }
        />
      </Route>
    </Routes>
  )
}

export default App