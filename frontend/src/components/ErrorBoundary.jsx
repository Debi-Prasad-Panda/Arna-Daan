import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info)
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <div className="min-h-screen bg-[#181210] flex items-center justify-center font-display text-white px-4">
        <div className="max-w-md w-full bg-[#23140f] border border-red-500/20 rounded-2xl p-8 flex flex-col items-center text-center gap-4">
          <div className="size-16 rounded-2xl bg-red-500/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-4xl text-red-400">error</span>
          </div>
          <div>
            <h2 className="text-xl font-black text-white">Something went wrong</h2>
            <p className="text-[#bca39a] text-sm mt-2">
              An unexpected error occurred. This has been noted.
            </p>
            {this.state.error?.message && (
              <p className="mt-3 text-xs text-red-400/70 bg-red-500/5 border border-red-500/10 rounded-lg px-3 py-2 font-mono">
                {this.state.error.message}
              </p>
            )}
          </div>
          <div className="flex gap-3 flex-wrap justify-center">
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="px-4 py-2 bg-primary hover:bg-orange-700 text-white font-bold text-sm rounded-xl transition-all"
            >
              Try Again
            </button>
            <button
              onClick={() => window.location.href = '/'}
              className="px-4 py-2 border border-[#3a2c27] text-[#bca39a] hover:text-white font-bold text-sm rounded-xl transition-all"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    )
  }
}
