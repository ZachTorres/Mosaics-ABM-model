export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Microsite Not Found</h2>
        <p className="text-gray-600 mb-8">
          This microsite doesn't exist or may have expired.
        </p>
        <a
          href="/"
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors inline-block"
        >
          Generate a New Microsite
        </a>
      </div>
    </div>
  )
}
