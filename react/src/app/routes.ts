import { index, type RouteConfig, route } from "@react-router/dev/routes";

export default [
	index("routes/landing-page.tsx"),
	route("Dashboard", "routes/dashboard.tsx"),
] satisfies RouteConfig;
