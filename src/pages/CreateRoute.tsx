import React, { useState } from 'react'
import { MapPin, Calendar, Plus } from 'lucide-react'
import axios from 'axios'

const CreateRoute: React.FC = () => {
  const [route, setRoute] = useState({
    origin: '',
    destination: '',
    departureDate: '',
    arrivalDate: '',
    stops: []
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await axios.post('http://localhost:5000/api/routes', route)
      console.log('Ruta creada:', response.data)
      // Aquí podrías redirigir al usuario o mostrar un mensaje de éxito
    } catch (error) {
      console.error('Error al crear la ruta:', error)
      // Aquí podrías mostrar un mensaje de error al usuario
    }
  }

  const addStop = () => {
    setRoute(prev => ({ ...prev, stops: [...prev.stops, { location: '', date: '' }] }))
  }

  // ... (resto del código del componente)

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Crear Nueva Ruta</h2>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        {/* ... (resto del formulario) */}
      </form>
    </div>
  )
}

export default CreateRoute