import { index, route, type RouteConfig } from "@react-router/dev/routes";

export default [
  index("routes/landing-page.tsx"),
  route("dashboard", "routes/dashboard.tsx"),
  route("Dashboard", "routes/dashboard-legacy.tsx"),
] satisfies RouteConfig;
