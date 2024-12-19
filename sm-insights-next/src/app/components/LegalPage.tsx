import React from 'react'

interface LegalPageProps {
  title: string
  lastUpdated: string
  content: React.ReactNode
}

export default function LegalPage({ title, lastUpdated, content }: LegalPageProps) {
  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden">
        <div className="px-6 py-8 sm:p-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">{title}</h1>
          <p className="text-sm text-gray-600 mb-6">Last updated: {lastUpdated}</p>
          
          <div className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none text-gray-500">
            {content}
          </div>
        </div>
      </div>
    </div>
  )
}

