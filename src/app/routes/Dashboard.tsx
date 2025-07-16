import type { Route } from '.react-router/types/src/app/routes/+types/LandingPage'

export function meta(_: Route.MetaArgs) {
  return [
    { title: 'Sortify - Dashboard' },
    {
      name: 'description',
      content:
        'Visualize and understand sorting algorithms with interactive animations. Learn bubble sort, merge sort, quick sort and more!',
    },
  ]
}

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-1 items-center justify-center overflow-hidden bg-gradient-to-br from-muted to-background pb-10">
      <h1 className="text-9xl text-primary">Coming soon...</h1>
    </div>
  )
}
