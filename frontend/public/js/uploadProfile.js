// Upload image profile
const API_URL = window.API_URL || 'http://localhost:3000'

document.getElementById('userProfile').addEventListener('change', async function (event) {
  event.preventDefault()
  console.log('Subiendo imagen de perfil...')
  console.log('API_URL:', API_URL)
  
  const fileInput = document.getElementById('userProfile')
  const file = fileInput.files[0]
  const previusFile = localStorage.getItem('profileURL')

  if (!file) {
    alert('Por favor, selecciona una imagen.')
    return
  }

  // FormData es una interfaz que permite construir un conjunto de pares clave/valor representando los campos del formulario y sus valores, para mandarlos fácilmente a fetch.
  const formData = new FormData()
  formData.append('userProfile', file)
  formData.append('previusUserProfile', previusFile)

  try {
    const response = await fetch(`${API_URL}/chat/images`, {
      method: 'POST',
      body: formData
    })

    const result = await response.json()
    // alert('Imagen subida:');

    // Actualizar la imagen de perfil en el frontend
    const profileImage = document.getElementById('profileImage')
    localStorage.setItem('profileURL', result.imageUrl)
    profileImage.src = `${API_URL}/uploads/${result.imageUrl}`
  } catch (error) {
    console.error('Error al subir la imagen:', error)
  } finally {
    location.reload()
  }
})
