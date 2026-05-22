import { forwardRef } from 'react'
import { PAGES } from '../data/constants'
import PageCard from './PageCard'

export default forwardRef(function PagesGrid(props, ref) {
  return (
    <section ref={ref} id="pages-section">
      <div className="mb-16 text-center">
        <h2 className="text-5xl font-black font-display tracking-tight mb-4">7 Pages of Magic</h2>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Explore the complete B-DAYFLIX experience with beautifully designed pages for every moment
        </p>
      </div>
      <div className="perspective-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8">
        {PAGES.map((page, i) => (
          <PageCard key={page.id} page={page} index={i} />
        ))}
      </div>
    </section>
  )
})
