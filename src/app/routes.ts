import { type RouteConfig, index, route } from '@react-router/dev/routes'

export default [
  index('routes/LandingPage.tsx'),
  route('Dashboard', 'routes/Dashboard.tsx'),
] satisfies RouteConfig
