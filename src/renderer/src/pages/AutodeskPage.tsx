import React, { useEffect, useRef, useState } from 'react'
import icon from '../assets/icon-autodesk-civil.png'

const DEFAULT_LICENSE_KEY = {
  service: 'annual',
  product: '54513781002',
  key: '057K3'
}

const AutodeskPage = (): React.JSX.Element => {
  const [service, setService] = useState('')
  const [productId, setProductId] = useState('')
  const [key, setKey] = useState('')
  const [isInvalid, setIsInvalid] = useState(false)
  const [status, setStatus] = useState<
    'idle' | 'validating' | 'verified' | 'downloading' | 'error' | 'paused'
  >('idle')
  const [downloadProgress, setDownloadProgress] = useState(0)
  const [error, setError] = useState('')
  const [isOnline, setIsOnline] = useState(true)
  const statusRef = useRef(status)

  useEffect(() => {
    statusRef.current = status
  }, [status])

  // Network status handling
  useEffect(() => {
    const handleOnline = (): void => {
      setIsOnline(true)
      setError('')
      if (statusRef.current === 'paused') {
        setStatus('downloading')
      }
    }

    const handleOffline = (): void => {
      setIsOnline(false)
      const currentStatus = statusRef.current
      if (currentStatus === 'downloading') {
        setStatus('paused')
        setError('Download paused. Reconnect to resume.')
      } else if (currentStatus === 'validating') {
        setStatus('error')
        setError('Validation failed. Connection lost.')
      } else {
        setError('Internet connection lost.')
      }
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Download simulation
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (status === 'downloading') {
      interval = setInterval(() => {
        if (!navigator.onLine) {
          setStatus('paused')
          setError('Download paused. Reconnect to resume.')
          clearInterval(interval)
          return
        }

        setDownloadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            return 100
          }
          return Math.min(prev + (prev < 75 ? 0.03 : 0.01), 100)
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [status])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    setError('')
    setIsInvalid(false)

    if (!isOnline) {
      setError('Internet connection required for activation')
      return
    }

    if (
      service !== DEFAULT_LICENSE_KEY.service ||
      productId !== DEFAULT_LICENSE_KEY.product ||
      key !== DEFAULT_LICENSE_KEY.key
    ) {
      setIsInvalid(true)
      setError('Invalid subscription plan, product code or activation key')
      return
    }

    try {
      setStatus('validating')

      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          navigator.onLine ? resolve(true) : reject(new Error('Connection lost'))
        }, 3000)

        return () => clearTimeout(timeout)
      })

      setStatus('verified')
      setTimeout(() => {
        if (navigator.onLine) {
          setStatus('downloading')
        } else {
          setStatus('error')
          setError('Connection lost before download')
        }
      }, 1000)
    } catch (err) {
      setStatus('error')
      setError(err instanceof Error ? err.message : 'Activation failed')
    }
  }

  const handleRetry = (): void => {
    setError('')
    setDownloadProgress(0)
    setStatus('idle')
  }

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl mx-auto">
        <div className="flex mb-8 gap-4 justify-center items-center">
          <img
            className="max-w-full h-12 md:h-20 object-contain object-center transition-opacity duration-300"
            src={icon}
            alt="Autodesk Logo"
          />
          <p className="font-bold uppercase text-2xl text-neutral-100">
<<<<<<< HEAD
            Autodesk AutoCAD <br /> Civil 3D 2025 Commercial
=======
            Autodesk AutoCAD <br /> Civil 3D 2022 Commercial
>>>>>>> 3ec3e2345b386906966dfd24ff87e70065aeb602
          </p>
        </div>

        <div className="bg-neutral-800 shadow-xl p-8 transition-all duration-300 ">
          <h1 className="text-3xl font-bold text-neutral-100 mb-8 text-center">
            {status === 'verified' || status === 'downloading'
              ? '✅ Activation Successful!'
              : status === 'error'
                ? '⚠️ Process Interrupted'
                : status === 'paused'
                  ? '⏸ Download Paused'
                  : '🔑 License Activation'}
          </h1>

          {error && (
            <div
              className={`mb-4 p-4  flex items-center gap-3 ${
                status === 'paused' ? 'bg-yellow-900/20' : 'bg-red-900/20'
              }`}
            >
              <svg
                className={`w-5 h-5 ${status === 'paused' ? 'text-yellow-400' : 'text-red-400'}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {status === 'paused' ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                )}
              </svg>
              <span
                className={`text-sm ${status === 'paused' ? 'text-yellow-300' : 'text-red-300'}`}
              >
                {error}
              </span>
            </div>
          )}

          {(status === 'idle' || status === 'validating') && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <select
                  value={service}
                  onChange={(e) => {
                    setService(e.target.value)
                    setIsInvalid(false)
                  }}
                  className={`w-full px-6 py-3 border-2 bg-neutral-700 text-white disabled:bg-neutral-700 border-neutral-600 focus:border-neutral-100 disabled:border-neutral-600 disabled:cursor-not-allowed focus:outline-none transition-all `}
                  disabled={status === 'validating'}
                  required
                >
                  <option value="">Select Subscription Plan</option>
                  <option value="annual">Annual License</option>
                  <option value="monthly">Monthly License</option>
                </select>

                <input
                  type="text"
                  value={productId}
                  onChange={(e) => {
                    setProductId(e.target.value)
                    setIsInvalid(false)
                  }}
                  className={`w-full px-6 py-3 border-2 bg-neutral-700 text-white disabled:bg-neutral-700 border-neutral-600 focus:border-neutral-100 disabled:border-neutral-600 disabled:cursor-not-allowed focus:outline-none transition-all `}
                  placeholder="Enter Subscription ID"
                  disabled={status === 'validating'}
                  required
                />

                <input
                  type="text"
                  value={key}
                  onChange={(e) => {
                    setKey(e.target.value)
                    setIsInvalid(false)
                  }}
                  className={`w-full px-6 py-3 border-2 bg-neutral-700 text-white disabled:bg-neutral-700 disabled:cursor-not-allowed focus:outline-none transition-all 
                    ${isInvalid ? 'border-red-500 pulse-animation' : 'border-neutral-600 focus:border-neutral-100 disabled:border-neutral-600'}`}
                  placeholder="Enter Subscription Key"
                  disabled={status === 'validating'}
                  required
                />
              </div>

              {isInvalid && (
                <p className="text-red-400 text-sm text-center flex items-center justify-center gap-2">
                  <svg
                    className="w-4 h-4 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  Invalid subscription plan, product code or activation key
                </p>
              )}

              <button
                type="submit"
                disabled={!service || !productId || !key || status === 'validating'}
                className={`w-full py-3 px-6 text-lg text-neutral-100 cursor-pointer font-medium disabled:cursor-not-allowed disabled:opacity-50 transition-all 
                  ${
                    status === 'validating'
                      ? 'bg-[#aa0c7d] cursor-not-allowed'
                      : 'bg-[#aa0c7d] hover:bg-[#aa0c7dd8] disabled:hover:bg-[#aa0c7d]'
                  }`}
              >
                {status === 'validating' ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="dot-flashing-animation" />
                    Verifying Credentials
                  </span>
                ) : (
                  'Activate Software'
                )}
              </button>
            </form>
          )}

          {status === 'verified' && (
            <div className="text-center space-y-8">
              <div className="animate-scale-in">
                <svg
                  className="mx-auto h-16 w-16 text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <p className="text-neutral-300 mt-4">
                  License activated successfully! Preparing download...
                </p>
              </div>
            </div>
          )}

          {(status === 'downloading' || status === 'paused') && (
            <div className="text-center space-y-8">
              <div className="space-y-4">
                <div className="relative h-6 bg-neutral-700/50 overflow-hidden shadow-inner">
                  <div
                    className={`absolute top-0 left-0 h-full transition-all duration-500 
                    shadow-[0_3px_10px_rgba(96,165,250,0.3)] ${
                      status === 'paused'
                        ? 'bg-yellow-400'
                        : 'bg-gradient-to-r from-blue-400 to-purple-500'
                    } striped-progress`}
                    style={{ width: `${downloadProgress}%` }}
                  >
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-blue-50">
                      {downloadProgress.toFixed(0)}%
                    </span>
                  </div>
                </div>

                <p className="text-neutral-300 text-sm">
                  {status === 'paused' ? (
                    `Paused at ${downloadProgress.toFixed(0)}%`
                  ) : downloadProgress < 100 ? (
                    <span className="flex items-end justify-center gap-2">
                      <svg
                        className="w-4 h-4 animate-bounce"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                        />
                      </svg>
                      Downloading installation files...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2 text-green-400">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Download complete! Starting installation...
                    </span>
                  )}
                </p>
                {status === 'paused' && (
                  <button
                    onClick={() =>
                      isOnline ? setStatus('downloading') : setError('Still offline')
                    }
                    className="px-6 py-2 bg-[#aa0c7d] hover:bg-[#aa0c7dd8] text-white  transition-colors"
                  >
                    {isOnline ? 'Resume Download' : 'Offline - Cannot Resume'}
                  </button>
                )}
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="text-center">
              <button
                onClick={handleRetry}
                className="px-6 py-2 bg-[#aa0c7d] hover:bg-[#aa0c7dd8] text-white  transition-colors"
              >
                Retry Activation
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
        .pulse-animation {
          animation: pulse 0.4s ease-in-out;
        }
        
        @keyframes scale-in {
          0% { transform: scale(0.8); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-scale-in {
          animation: scale-in 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        @keyframes pulse-glow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        
        @keyframes dot-flash {
          0%, 80%, 100% { opacity: 0; }
          40% { opacity: 1; }
        }
          
        .dot-flashing-animation {
          position: relative;
          width: 12px;
          height: 12px;
        }
        .dot-flashing-animation::before,
        .dot-flashing-animation::after {
          top: calc(50% - 2px);
          content: '';
          position: absolute;
          width: 4px;
          height: 4px;
          background: currentColor;
          border-radius: 50%;
          animation: dot-flash 1s infinite linear;
        }
        .dot-flashing-animation::before {
          left: -8px;
          animation-delay: -0.16s;
        }
        .dot-flashing-animation::after {
          left: 8px;
          animation-delay: 0.16s;
        }
      `}</style>
    </div>
  )
}

export default AutodeskPage
