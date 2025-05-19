import React, { useEffect } from 'react'
import icon from '../assets/icon.png'

const DEFAULT_LICENSE_KEY = {
  service: 'annual',
  product: '237O1-WW3740-L562',
  key: '237O1-WW3740-L562-VC'
}

const AutodeskPage = (): React.JSX.Element => {
  const [service, setService] = React.useState('')
  const [productId, setProductId] = React.useState('')
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
        setDownloadProgress((prev) => (prev >= 100 ? 100 : prev + 0.01))
      }, 500)
    }
    return () => clearInterval(interval)
  }, [status])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault()
    if (
      service !== DEFAULT_LICENSE_KEY.service ||
      productId !== DEFAULT_LICENSE_KEY.product ||
      key !== DEFAULT_LICENSE_KEY.key
    ) {
      setIsInvalid(true)
      return
    }

    setIsInvalid(false)
    setStatus('validating')

    setTimeout(() => {
      setStatus('verified')
      setTimeout(() => {
        setStatus('downloading')
      }, 1000)
    }, 3000)
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
            Autodesk AutoCAD <br /> Civil 3D 2023 Commercial
          </p>
        </div>

        <div className="bg-neutral-800 shadow-xl p-8 transition-all duration-300 ">
          <h1 className="text-3xl font-bold text-neutral-100 mb-8 text-center">
            {status === 'verified' || status === 'downloading'
              ? '✅ Activation Successful!'
              : '🔑 License Activation'}
          </h1>

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

          {status === 'downloading' && (
            <div className="text-center space-y-8">
              <div className="space-y-4">
                <div className="relative h-6 bg-neutral-700/50 overflow-hidden shadow-inner">
                  <div
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-400 to-purple-500 transition-all duration-500 
                    shadow-[0_3px_10px_rgba(96,165,250,0.3)] striped-progress"
                    style={{ width: `${downloadProgress}%` }}
                  >
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-blue-50">
                      {downloadProgress.toFixed(0)}%
                    </span>
                  </div>
                </div>

                <p className="text-neutral-300 text-center text-sm">
                  {downloadProgress < 100 ? (
                    <span className="flex items-center justify-center gap-2">
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
                  <span className="block text-blue-400 text-xs mt-2">
                    {downloadProgress >= 100 &&
                      'Your software is ready for setup. Please follow installation prompts.'}
                  </span>
                </p>
              </div>
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
