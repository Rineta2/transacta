import { FiHome } from "react-icons/fi";

import { LuLayoutDashboard } from "react-icons/lu";

import { AiOutlineTransaction } from "react-icons/ai";

import { RiPageSeparator, RiUserSettingsFill } from "react-icons/ri";

import { IoIosContact } from "react-icons/io";

import { MdAdminPanelSettings } from "react-icons/md";

export const menuItems = [
  {
    icon: LuLayoutDashboard,
    label: "Dashboard",
    href: "/super-admins/dashboard",
  },

  {
    icon: RiPageSeparator,
    label: "Payment",
    href: "/super-admins/dashboard/payment",
    subItems: [
      { label: "Daftar Payment", href: "/super-admins/dashboard/payment" },
    ],
  },

  {
    icon: AiOutlineTransaction,
    label: "Transaction",
    href: "/super-admins/dashboard/transaction",
    subItems: [
      {
        label: "Daftar Transaction",
        href: "/super-admins/dashboard/transaction",
      },

      {
        label: "Completed",
        href: "/super-admins/dashboard/transaction/completed",
      },

      {
        label: "Cancelled",
        href: "/super-admins/dashboard/transaction/cancelled",
      },
    ],
  },

  {
    icon: MdAdminPanelSettings,
    label: "Admin",
    href: "/super-admins/dashboard/admin",
  },

  {
    icon: IoIosContact,
    label: "Contact",
    href: "/super-admins/dashboard/contact",
    subItems: [
      {
        label: "Daftar Contact",
        href: "/super-admins/dashboard/contact",
      },
    ],
  },

  {
    icon: RiUserSettingsFill,
    label: "Profile",
    href: "/super-admins/dashboard/profile",
  },

  {
    icon: FiHome,
    label: "Home",
    href: "/",
  },
];
