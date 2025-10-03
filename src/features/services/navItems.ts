import type { ServiceNavItem } from "../../components/ServicesNav";

// Authoritative order for Services & Solutions routes
export const servicesNavItems: ServiceNavItem[] = [
  {
    path: "/services/centralize-management",
    labelKey: "centralize:centralizeManagement",
  },
  {
    path: "/services/multimedia-solution",
    labelKey: "multimedia:multimediaSolution",
  },
  {
    path: "/services/digital-transformation",
    labelKey: "digitalTransformation:digitalTransformation",
  },
  {
    path: "/services/network-solution",
    labelKey: "networkSecurity:networkSecurity",
  },
  {
    path: "/services/data-center",
    labelKey: "dataCenter:dataCenter",
  },
  {
    path: "/services/data-management",
    labelKey: "dataManagement:dataManagement",
  },
];
