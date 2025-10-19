'use client'

import { useParams } from 'next/navigation'
import DynamicSubjectPage from '@/components/DynamicSubjectPage'
import { subjects } from './subjects-data'

export default function SATPage() {
  const params = useParams()
  const subjectKey = params.subject

  const subjectData = subjects[subjectKey]

  if (!subjectData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Section Not Found</h1>
          <p className="text-gray-400">The section &quot;{subjectKey}&quot; does not exist.</p>
        </div>
      </div>
    )
  }

  return <DynamicSubjectPage config={subjectData.config} dataFiles={subjectData.dataFiles} />
}
