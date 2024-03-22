import bcrypt from 'bcrypt'

export const test = async function hashPassword(password) {
  const salt = await bcrypt.genSalt(15)

  console.log(salt)
  return bcrypt.hash(password, salt)
}

console.log(await test('password'))
