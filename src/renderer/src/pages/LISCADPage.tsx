import React, { useEffect, useRef, useState } from 'react'
import logo from '../assets/logo-liscad.png'

const DEFAULT_LICENSE_KEY = 'DAHIJ79NAHYAR'
const VALIDATION_DELAY = 3000

const LISCADPage = (): React.JSX.Element => {
  const [key, setKey] = useState('')
  const [isInvalid, setIsInvalid] = useState(false)
  const [status, setStatus] = useState<
    'idle' | 'validating' | 'verified' | 'downloading' | 'error' | 'paused'
  >('idle')
  const [downloadProgress, setDownloadProgress] = useState(0)
  const [error, setError] = useState('')
  const [isOnline, setIsOnline] = useState(true)
  const statusRef = useRef(status)

  // Sync status with ref
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
        setDownloadProgress((prev): number => {
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
      setError('Internet connection required for validation.')
      return
    }

    if (key !== DEFAULT_LICENSE_KEY) {
      setIsInvalid(true)
      setError('Invalid license key.')
      return
    }

    try {
      setStatus('validating')
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          navigator.onLine ? resolve(true) : reject(new Error('Connection lost'))
        }, VALIDATION_DELAY)
        return () => clearTimeout(timeout)
      })

      setStatus('verified')
      setTimeout(() => {
        if (navigator.onLine) {
          setStatus('downloading')
        } else {
          setStatus('error')
          setError('Connection lost before download.')
        }
      }, 1000)
    } catch (err) {
      setStatus('error')
      setError(err instanceof Error ? err.message : 'Validation failed')
    }
  }

  const handleRetry = (): void => {
    setError('')
    setDownloadProgress(0)
    setStatus('idle')
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-xl mx-auto">
        <img className="mx-auto h-20 mb-8" src={logo} alt="LISCAD Logo" />

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            {status === 'verified' || status === 'downloading'
              ? '🎉 Successful Verification!'
              : status === 'error'
                ? '⚠️ Process Interrupted'
                : status === 'paused'
                  ? '⏸ Download Paused'
                  : '🔑 License Validation'}
          </h1>

          {error && (
            <div
              className={`mb-4 p-4 rounded-lg flex items-center gap-3 ${
                status === 'paused' ? 'bg-yellow-50' : 'bg-red-50'
              }`}
            >
              <svg
                className={`w-5 h-5 ${status === 'paused' ? 'text-yellow-500' : 'text-red-500'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                {status === 'paused' ? (
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM8 5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 018 5zm3 3a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0111 8z"
                    clipRule="evenodd"
                  />
                ) : (
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                    clipRule="evenodd"
                  />
                )}
              </svg>
              <span
                className={`text-sm ${status === 'paused' ? 'text-yellow-600' : 'text-red-600'}`}
              >
                {error}
              </span>
            </div>
          )}

          {(status === 'idle' || status === 'validating') && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <input
                  type="text"
                  value={key}
                  onChange={(e) => {
                    setKey(e.target.value)
                    setIsInvalid(false)
                    setError('')
                  }}
                  className={`w-full px-6 py-3 rounded-lg border-2 focus:outline-none transition-all ${
                    isInvalid
                      ? 'border-red-500 shake-animation'
                      : 'border-gray-200 focus:border-blue-500'
                  } ${status === 'validating' ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
                  placeholder="Enter license key"
                  disabled={status === 'validating'}
                />
              </div>

              <button
                type="submit"
                disabled={!key || status === 'validating'}
                className={`w-full py-2 px-6 text-lg font-medium rounded-lg transition-all ${
                  status === 'validating'
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {status === 'validating' ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Validating...
                  </span>
                ) : (
                  'Activate License'
                )}
              </button>
            </form>
          )}

          {status === 'verified' && (
            <div className="text-center space-y-8 animate-scale-in">
              <svg
                className="mx-auto h-16 w-16 text-green-500"
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
              <p className="text-gray-600">License verified! Starting download...</p>
            </div>
          )}

          {(status === 'downloading' || status === 'paused') && (
            <div className="text-center space-y-8">
              <div className="space-y-4">
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      status === 'paused'
                        ? 'bg-yellow-400'
                        : 'bg-gradient-to-r from-green-400 to-emerald-500'
                    }`}
                    style={{ width: `${downloadProgress}%` }}
                  />
                </div>
                <p className="text-gray-600 text-sm">
                  {status === 'paused' ? (
                    `Paused at ${downloadProgress.toFixed(0)}%`
                  ) : downloadProgress < 100 ? (
                    `Downloading: ${downloadProgress.toFixed(0)}%`
                  ) : (
                    <span className="text-green-600">Download complete!</span>
                  )}
                </p>
              </div>
              {status === 'paused' && (
                <button
                  onClick={() => (isOnline ? setStatus('downloading') : setError('Still offline'))}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  {isOnline ? 'Resume Download' : 'Offline - Cannot Resume'}
                </button>
              )}
            </div>
          )}

          {status === 'error' && (
            <div className="text-center">
              <button
                onClick={handleRetry}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Retry Process
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-6px); }
          75% { transform: translateX(6px); }
        }
        .shake-animation {
          animation: shake 0.4s ease-in-out;
        }
        @keyframes scale-in {
          0% { transform: scale(0.8); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-scale-in {
          animation: scale-in 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
    </div>
  )
}

export default LISCADPage
