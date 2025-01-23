import {
  HiOutlineCalendar as CalendarIcon,
  HiOutlineChartPie as ChartPieIcon,
  HiOutlineDocumentDuplicate as DocumentDuplicateIcon,
  HiOutlineFolder as FolderIcon,
  HiOutlineHome as HomeIcon,
  HiOutlineUsers as UsersIcon,
} from "@preact-icons/hi2";

export const navigationItems = [
  { name: "Dashboard", href: "#", icon: HomeIcon, current: true },
  { name: "Team", href: "#", icon: UsersIcon, current: false },
  { name: "Projects", href: "#", icon: FolderIcon, current: false },
  { name: "Calendar", href: "#", icon: CalendarIcon, current: false },
  { name: "Documents", href: "#", icon: DocumentDuplicateIcon, current: false },
  { name: "Reports", href: "#", icon: ChartPieIcon, current: false },
];

export type NavigationItem = typeof navigationItems[number];
