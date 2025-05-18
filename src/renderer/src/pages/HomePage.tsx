import React, { useEffect } from 'react'
import logo from '../assets/logo.png'

const DEFAULT_LICENSE_KEY = 'DAHIJ79NAHYAR'
const DOWNLOAD_URL =
  'https://portal.listech.com/downloads/liscad/release/LtLiscadSetupUS.exe?_gl=1*1ecfh6g*_ga*NTA4NDg5MTY2LjE3NDc0OTIyNTI.*_ga_J9Y8Q8BT53*czE3NDc1OTc5ODgkbzIkZzAkdDE3NDc1OTc5OTckajUxJGwwJGgwJGRLUldGSFNMd3BoVmxoRHg0aURocDEyT2lOVDBTMVlsWFFn*_gcl_au*MTE4MDI0NDYxOS4xNzQ3NDkyMjUy'

const HomePage = (): React.JSX.Element => {
  const [key, setKey] = React.useState('')
  const [isInvalid, setIsInvalid] = React.useState(false)
  const [status, setStatus] = React.useState<'idle' | 'validating' | 'verified' | 'downloading'>(
    'idle'
  )
  const [downloadProgress, setDownloadProgress] = React.useState(0)

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (status === 'downloading') {
      interval = setInterval(() => {
        setDownloadProgress((prev) => (prev >= 100 ? 100 : prev + 10))
      }, 500)
    }
    return () => clearInterval(interval)
  }, [status])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault()
    if (key !== DEFAULT_LICENSE_KEY) {
      setIsInvalid(true)
      return
    }

    setIsInvalid(false)
    setStatus('validating')

    setTimeout(() => {
      setStatus('verified')
      setTimeout(() => {
        setStatus('downloading')
        triggerDownload()
      }, 1000)
    }, 3000)
  }

  const triggerDownload = (): void => {
    const link = document.createElement('a')
    link.href = DOWNLOAD_URL
    link.setAttribute('download', 'LtLiscadSetupUS.exe')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-xl mx-auto">
        <img
          className="mx-auto h-20 md:h-32 mb-8 transition-opacity duration-300"
          src={logo}
          alt="LISCAD Logo"
        />

        <div className="bg-white rounded-2xl shadow-xl p-8 transition-all duration-300">
          <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            {status === 'verified' || status === 'downloading'
              ? '🎉 Successful Verification!'
              : '🔑 License Validation'}
          </h1>

          {(status === 'idle' || status === 'validating') && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <input
                  type="text"
                  value={key}
                  onChange={(e) => {
                    setKey(e.target.value)
                    setIsInvalid(false)
                  }}
                  className={`w-full px-5 py-3 rounded-lg border-2 focus:outline-none transition-all ${
                    isInvalid
                      ? 'border-red-500 shake-animation'
                      : 'border-gray-200 focus:border-blue-500'
                  } ${status === 'validating' ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
                  placeholder="Enter your license key"
                  disabled={status === 'validating'}
                />
                {isInvalid && (
                  <p className="text-red-500 text-sm mt-2 ml-1 flex items-center gap-2">
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
                    Invalid license key. Please try again.
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={!key || status === 'validating'}
                className={`w-full py-3.5 text-lg font-medium rounded-lg transition-all ${
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
            <div className="text-center space-y-8">
              <div className="animate-scale-in">
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
                <p className="text-gray-600 mt-4">
                  License verified successfully! Starting download...
                </p>
              </div>
            </div>
          )}

          {status === 'downloading' && (
            <div className="text-center space-y-8">
              <div className="space-y-4">
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-500"
                    style={{ width: `${downloadProgress}%` }}
                  />
                </div>
                <p className="text-gray-600 text-center text-sm">
                  <p>
                    {downloadProgress < 100 ? (
                      <>Downloading LISCAD {downloadProgress}%...</>
                    ) : (
                      <>LISCAD Downloaded!</>
                    )}
                  </p>
                  <p className="text-rose-500 text-xs">
                    {downloadProgress >= 100 &&
                      'Its may taking 2 or 3 working day for  a proper activation. Please wait.'}
                  </p>
                </p>
              </div>
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

export default HomePage
