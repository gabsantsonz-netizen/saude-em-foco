'use client'

import { useEffect } from 'react'

export default function AdBanner() {
  useEffect(() => {
    if (typeof window === 'undefined') return

    const ads = (window as any).adsbygoogle || []
    ads.push({})
  }, [])

  return (
    <div className="mx-auto max-w-full rounded-3xl border border-slate-200 bg-slate-50 p-4 shadow-sm shadow-slate-200/40 dark:border-slate-800 dark:bg-slate-950 md:p-6">
      <ins
        className="adsbygoogle block h-auto w-full overflow-hidden rounded-3xl bg-slate-100 text-center dark:bg-slate-900"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-4638492224253055"
        data-ad-slot="1234567890"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  )
}
