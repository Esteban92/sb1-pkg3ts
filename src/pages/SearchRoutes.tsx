import React, { useState } from 'react'
import { Search, MapPin, Calendar } from 'lucide-react'

const SearchRoutes: React.FC = () => {
  const [searchParams, setSearchParams] = useState({
    origin: '',
    destination: '',
    date: ''
  })

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Aquí iría la lógica para buscar rutas en el backend
    console.log('Buscando rutas:', searchParams)
  }

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Buscar Rutas</h2>
      <form onSubmit={handleSearch} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="origin">
            Origen
          </label>
          <div className="flex items-center">
            <MapPin className="mr-2 text-gray-500" />
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="origin"
              type="text"
              placeholder="Ciudad de origen"
              value={searchParams.origin}
              onChange={(e) => setSearchParams({ ...searchParams, origin: e.target.value })}
            />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="destination">
            Destino
          </label>
          <div className="flex items-center">
            <MapPin className="mr-2 text-gray-500" />
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="destination"
              type="text"
              placeholder="Ciudad de destino"
              value={searchParams.destination}
              onChange={(e) => setSearchParams({ ...searchParams, destination: e.target.value })}
            />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="date">
            Fecha
          </label>
          <div className="flex items-center">
            <Calendar className="mr-2 text-gray-500" />
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="date"
              type="date"
              value={searchParams.date}
              onChange={(e) => setSearchParams({ ...searchParams, date: e.target.value })}
            />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center"
            type="submit"
          >
            <Search className="mr-2" />
            Buscar Rutas
          </button>
        </div>
      </form>
      {/* Aquí iría la lista de resultados de la búsqueda */}
      <div className="mt-8">
        <h3 className="text-2xl font-bold mb-4">Resultados de la búsqueda</h3>
        {/* Ejemplo de resultado */}
        <div className="bg-white shadow-md rounded p-4 mb-4">
          <h4 className="text-lg font-semibold">Madrid - París</h4>
          <p className="text-gray-600">Fecha: 15 de Julio, 2024</p>
          <p className="text-gray-600">Viajero: Juan Pérez</p>
          <button className="mt-2 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
            Solicitar Envío
          </button>
        </div>
      </div>
    </div>
  )
}

export default SearchRoutes