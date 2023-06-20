export function randomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min)) + min
}
export function daysOrHours() {
  return Math.round(Math.random()) ? 'days' : 'hours'
}
