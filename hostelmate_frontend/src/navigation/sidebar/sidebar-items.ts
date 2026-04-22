import {
  Banknote,
  ChartBar,
  Fingerprint,
  Gauge,
  LayoutDashboard,
  type LucideIcon,
  Star,
  Stars,
} from "lucide-react";

export interface NavSubItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  comingSoon?: boolean;
  newTab?: boolean;
  isNew?: boolean;
}

export interface NavMainItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  subItems?: NavSubItem[];
  comingSoon?: boolean;
  newTab?: boolean;
  isNew?: boolean;
}

export interface NavGroup {
  id: number;
  label?: string;
  items: NavMainItem[];
}

export const sidebarItems: NavGroup[] = [
  {
    id: 1,
    label: "Dashboards",
    items: [
      {
        title: "Mess rating",
        url: "/dashboard/mess-rating",
        icon: LayoutDashboard,
      },
      {
        title: "Mess Menu",
        url: "/dashboard/mess-menu",
        icon: ChartBar,
      },
      {
        title: "Rate Meal",
        url: "/dashboard/rating",
        icon: Star,
      },
      {
        title: "Account",
        url: "/dashboard/account",
        icon: Banknote,
      },
      {
        title: "Complaints",
        url: "/dashboard/complaints",
        icon: Stars,
      },
    ],
  },
  {
    id: 2,
    label: "Pages",
    items: [
      {
        title: "Authentication",
        url: "/auth",
        icon: Fingerprint,
        subItems: [
          { title: "Login v1", url: "/auth/v1/login", newTab: true },
          { title: "Register v1", url: "/auth/v1/register", newTab: true },
        ],
      },
    ],
  },
 
];


export const wardenSidebarItems: NavGroup[] = [
  {
    id: 1,
    label: "Warden Dashboards",
    items: [
      {
        title: "Mess rating",
        url: "/dashboard/mess-rating",
        icon: LayoutDashboard,
      },
      {
        title: "Mess Menu",
        url: "/warden-dashboard/mess-menu",
        icon: ChartBar,
      },
      {
        title: "Account",
        url: "/warden-dashboard/account",
        icon: Banknote,
      },
      {
        title: "Users",
        url: "/warden-dashboard/users",
        icon: Gauge,
      }
    ],
  }
 
];
