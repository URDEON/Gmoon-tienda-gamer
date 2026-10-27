// Cada función devuelve un texto de error, o '' si el valor es válido.

export const validarNombre = (nombre) => {
  if (!nombre.trim()) return 'Ingresa tu nombre completo.'
  if (nombre.trim().length < 3) return 'El nombre debe tener al menos 3 caracteres.'
  return ''
}

export const validarEmail = (email) => {
  if (!email.trim()) return 'Ingresa tu correo electrónico.'
  const patron = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!patron.test(email.trim())) return 'Ingresa un correo válido, por ejemplo ejemplo@correo.com.'
  return ''
}

export const validarPassword = (password) => {
  if (!password) return 'Ingresa tu contraseña.'
  if (password.length < 8) return 'La contraseña debe tener al menos 8 caracteres.'
  return ''
}

export const validarConfirmacion = (password, confirmacion) => {
  if (!confirmacion) return 'Confirma tu contraseña.'
  if (password !== confirmacion) return 'Las contraseñas no coinciden.'
  return ''
}