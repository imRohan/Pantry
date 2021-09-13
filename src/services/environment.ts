export function isDevelopment(): boolean {
  const _environment = process.env.NODE_ENV
  return _environment === 'development'
}
