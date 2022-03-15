export function isDevelopment(): boolean {
  const _devEnvironments = ['development', 'test']
  const _currentEnvironment = process.env.NODE_ENV
  return _devEnvironments.includes(_currentEnvironment)
}
