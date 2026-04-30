import {HeroSectionSkeleton} from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <div className="theme-home bg-background-light dark:bg-background-dark text-text-main dark:text-white font-display antialiased min-h-screen flex flex-col">
      <main className="flex-grow">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <HeroSectionSkeleton />

          <div className="w-full h-px bg-gray-200 dark:bg-gray-800 mb-12"></div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8 flex flex-col gap-9">
              <div className="flex items-center justify-between pb-4 border-b border-black dark:border-white">
                <div className="flex flex-col gap-1">
                  <div className="w-8 h-[2px] bg-gray-300 dark:bg-gray-600 mb-1"></div>
                  <div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                </div>
                <div className="h-4 w-20 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
              </div>

              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((idx) => (
                <div key={idx}>
                  <div className="flex flex-col sm:flex-row gap-6">
                    <div className="relative w-full sm:w-64 aspect-[4/3] sm:aspect-video bg-gray-200 dark:bg-gray-800 rounded-sm overflow-hidden flex-shrink-0 animate-pulse"></div>
                    <div className="flex flex-col justify-center gap-2">
                      <div className="h-4 w-20 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                      <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                      <div className="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                      <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                    </div>
                  </div>
                  {idx < 9 ? (
                    <div className="w-full h-px bg-gray-200 dark:bg-gray-800"></div>
                  ) : null}
                </div>
              ))}
            </div>

            <div className="lg:col-span-4 pl-0 lg:pl-6 lg:border-l border-gray-200 dark:border-gray-800">
              <div className="lg:sticky lg:top-24">
                <div className="flex items-center gap-2 mb-6 pb-2 border-b-2 border-gray-300 dark:border-gray-600 w-fit">
                  <div className="h-5 w-5 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                  <div className="h-6 w-24 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                </div>

                <div className="flex flex-col relative">
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map((idx) => (
                    <div key={idx} className="flex gap-4 relative">
                      <div className="flex flex-col items-center flex-shrink-0 relative">
                        <div className="w-2.5 h-2.5 rounded-full mt-1.5 bg-gray-300 dark:bg-gray-600 animate-pulse"></div>
                        {idx < 14 && (
                          <div className="w-px flex-grow min-h-[24px] mt-1 bg-gray-300 dark:bg-gray-700 animate-pulse"></div>
                        )}
                      </div>
                      <div className="flex flex-col gap-1 pb-6">
                        <div className="h-4 w-24 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                        <div className="h-5 w-full bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 p-4 bg-white dark:bg-white/5 rounded-lg border border-gray-100 dark:border-white/10 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-4 w-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                    <div className="h-5 w-32 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                  </div>
                  <div className="h-4 w-full mb-3 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                  <div className="h-10 w-full mb-2 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                  <div className="h-10 w-full bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}