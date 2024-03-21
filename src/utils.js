export const getRandomInt = (min, max) => {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export const getRandomElement = (arr) => {
  return arr[getRandomInt(0, arr.length - 1)]
}

export const objectIdRegex = /^[0-9a-fA-F]{24}$/
