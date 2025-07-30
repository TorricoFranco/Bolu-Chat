import z from 'zod'

const userSchema = z.object({
  username: z
    .string()
    .min(3, 'El username debe tener al menos 3 caracteres')
    .max(20, 'El username no puede tener más de 20 caracteres'),
  password: z
    .string()
    .min(7, { message: 'El password debe tener al menos 8 caracteres' })
    .max(32, 'El password no puede tener más de 32 caracteres')
    .regex(/[A-Z]/, 'El password debe incluir al menos una letra mayúscula')
    .regex(/[a-z]/, 'El password debe incluir al menos una letra minúscula')
    .regex(/\d/, 'El password debe incluir al menos un número')
    .regex(/[@$!%*?&]/, 'El password debe incluir al menos un carácter especial (@, $, !, %, *, ?, &).')
})

export function validateUser (input) {
  return userSchema.safeParse(input)
}
