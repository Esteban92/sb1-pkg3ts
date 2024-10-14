import React from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Package } from 'lucide-react'

const TravelerDashboard: React.FC = () => {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Panel de Viajero</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Mis Rutas</h3>
          {/* Aquí iría una lista de rutas del viajero */}
          <Link to="/create-route" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded flex items-center justify-center mt-4">
            <MapPin className="mr-2" />
            Crear Nueva Ruta
          </Link>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Solicitudes de Envío</h3>
          {/* Aquí iría una lista de solicitudes de envío */}
          <Link to="/search-routes" className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded flex items-center justify-center mt-4">
            <Package className="mr-2" />
            Buscar Solicitudes
          </Link>
        </div>
      </div>
    </div>
  )
}

export default TravelerDashboard