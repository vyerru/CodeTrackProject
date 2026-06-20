export interface NetworkConfig {
  minDelay: number
  maxDelay: number
  failureRate: number
}

let config: NetworkConfig = { minDelay: 200, maxDelay: 800, failureRate: 0 }

export function setNetworkConfig(cfg: NetworkConfig): void {
  config = cfg
}

export function getNetworkConfig(): NetworkConfig {
  return config
}

export function simulatedDelay(): Promise<void> {
  const { minDelay, maxDelay, failureRate } = config
  const delay = minDelay + Math.random() * (maxDelay - minDelay)
  const shouldFail = Math.random() < failureRate

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail) {
        reject(new Error('Simulated network error'))
      } else {
        resolve()
      }
    }, delay)
  })
}
