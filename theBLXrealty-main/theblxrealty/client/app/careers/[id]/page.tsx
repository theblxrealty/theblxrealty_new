import { Suspense } from 'react'
import JobDetailContent from './job-detail-content'

export default function JobDetailPage() {
  return (
    <Suspense fallback={<div>Loading job details...</div>}>
      <JobDetailContent />
    </Suspense>
  )
}
