import { useState } from 'react'

export default function EventCard({ event }) {
  const [showDetails, setShowDetails] = useState(false)
  const categoryColors = {
    Music: 'text-primary',
    Tech: 'text-purple-600',
    'Live Music': 'text-rose-600',
    Workshop: 'text-yellow-700',
    Education: 'text-indigo-700',
    Cinema: 'text-emerald-700',
    Concerts: 'text-primary',
    Hackathons: 'text-purple-600',
    'Jamming Sessions': 'text-rose-600',
    'Art Gallery': 'text-yellow-700',
  }
  const badgeColor = categoryColors[event.category] ?? 'text-primary'

  function formatDate(dateStr) {
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    })
  }

  function handleViewDetails() {
    setShowDetails(true)
  }

  function handlePayment() {
    if (event.payment_link) {
      window.location.href = event.payment_link
    }
  }

  return (
    <>
    <article className="bg-white rounded-lg overflow-hidden card-shadow flex flex-col h-full">
      <div className="aspect-video relative overflow-hidden bg-blue-100">
        {event.image_url ? (
          <img
            alt={event.title}
            className="w-full h-full object-cover"
            src={event.image_url}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary-light to-primary/20 flex items-center justify-center">
            <span className="text-primary/40 text-4xl font-bold">{event.category[0]}</span>
          </div>
        )}
        <span className={`absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-lg text-xs font-bold ${badgeColor} uppercase`}>
          {event.category}
        </span>
      </div>
      <div className="p-6 flex-grow flex flex-col">
        <h3 className="text-xl font-extrabold text-gray-900 mb-2 leading-tight">
          {event.title}
        </h3>
        <div className="space-y-2 mb-6">
          <div className="flex items-center text-gray-500 text-sm">
            <svg className="w-4 h-4 mr-2 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{formatDate(event.date)}</span>
          </div>
          <div className="flex items-center text-gray-500 text-sm">
            <svg className="w-4 h-4 mr-2 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{event.location}</span>
          </div>
        </div>
        <button
          onClick={handleViewDetails}
          className="w-full min-h-[44px] flex items-center justify-center bg-primary-light text-primary hover:bg-primary hover:text-white font-bold py-3 rounded-lg transition-all duration-300 mt-auto"
        >
          View Details
        </button>
      </div>
    </article>

    {showDetails && (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
        onClick={() => setShowDetails(false)}
      >
        <div
          className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {event.image_url ? (
            <img
              src={event.image_url}
              alt={event.title}
              className="w-full aspect-video object-cover rounded-t-lg"
            />
          ) : (
            <div className="w-full aspect-video bg-gradient-to-br from-primary-light to-primary/20 rounded-t-lg flex items-center justify-center">
              <span className="text-primary/40 text-5xl font-bold">{event.category[0]}</span>
            </div>
          )}
          <div className="p-6">
            <span className={`inline-block px-3 py-1 rounded-lg text-xs font-bold ${badgeColor} uppercase mb-3`}>
              {event.category}
            </span>
            <h2 className="text-2xl font-extrabold text-gray-900 mb-4">{event.title}</h2>
            <div className="space-y-2 mb-4 text-gray-600">
              <div className="flex items-center text-sm">
                <svg className="w-4 h-4 mr-2 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{formatDate(event.date)}</span>
              </div>
              <div className="flex items-center text-sm">
                <svg className="w-4 h-4 mr-2 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{event.location}</span>
              </div>
            </div>
            {event.description && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Description</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{event.description}</p>
              </div>
            )}
            <div className="flex gap-3">
              <button
                onClick={handlePayment}
                className="flex-1 py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-lg transition-colors"
              >
                Proceed to Payment
              </button>
              <button
                onClick={() => setShowDetails(false)}
                className="min-h-[44px] px-4 py-3 flex items-center border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
    </>
  )
}
