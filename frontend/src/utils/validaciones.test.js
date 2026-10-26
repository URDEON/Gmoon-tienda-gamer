import { describe, expect, it } from 'vitest'
import {
  validarConfirmacion,
  validarEmail,
  validarNombre,
  validarPassword,
} from './validaciones'

describe('validarNombre', () => {
  it('acepta un nombre de al menos tres caracteres ignorando espacios externos', () => {
    expect(validarNombre('  Omar Gamer  ')).toBe('')
  })

  it('requiere un nombre', () => {
    expect(validarNombre('   ')).toBe('Ingresa tu nombre completo.')
  })

  it('rechaza nombres de menos de tres caracteres', () => {
    expect(validarNombre('Jo')).toBe('El nombre debe tener al menos 3 caracteres.')
  })
})

describe('validarEmail', () => {
  it('acepta una dirección de correo válida', () => {
    expect(validarEmail('  gamer@ejemplo.cl  ')).toBe('')
  })

  it('requiere una dirección de correo', () => {
    expect(validarEmail('   ')).toBe('Ingresa tu correo electrónico.')
  })

  it('rechaza una dirección sin formato de correo', () => {
    expect(validarEmail('gamer@ejemplo')).toBe(
      'Ingresa un correo válido, por ejemplo ejemplo@correo.com.',
    )
  })
})

describe('validarPassword', () => {
  it('acepta una contraseña de ocho caracteres o más', () => {
    expect(validarPassword('gamer123')).toBe('')
  })

  it('requiere una contraseña', () => {
    expect(validarPassword('')).toBe('Ingresa tu contraseña.')
  })

  it('rechaza contraseñas de menos de ocho caracteres', () => {
    expect(validarPassword('gamer12')).toBe(
      'La contraseña debe tener al menos 8 caracteres.',
    )
  })
})

describe('validarConfirmacion', () => {
  it('acepta contraseñas coincidentes', () => {
    expect(validarConfirmacion('gamer123', 'gamer123')).toBe('')
  })

  it('rechaza una confirmación diferente', () => {
    expect(validarConfirmacion('gamer123', 'gamer321')).toBe(
      'Las contraseñas no coinciden.',
    )
  })

  it('requiere confirmar la contraseña', () => {
    expect(validarConfirmacion('gamer123', '')).toBe('Confirma tu contraseña.')
  })
})
