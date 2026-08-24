import { defineEventHandler, getQuery, createError } from 'h3'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const dni = query.dni as string

  if (!dni || dni.length !== 10) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Cédula inválida',
    })
  }

  const targetUrl = 'https://si.secap.gob.ec/sisecap/logeo_web/json/busca_persona_registro_civil.php'
  
  try {
    const formData = new URLSearchParams()
    formData.append('documento', dni)
    formData.append('tipo', '1')

    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
    })

    if (!response.ok) {
      throw createError({
        statusCode: response.status,
        statusMessage: 'Error al consultar los datos',
      })
    }

    const data = await response.json()
    if (!data.nombres || data.respuesta === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: data.mensaje || data.error || 'Cédula no válida o no encontrada',
      })
    }
    
    return data
  } catch (error: any) {
    console.error('Error fetching cedula:', error)
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Error interno del servidor',
    })
  }
})
