import { FiHome } from "react-icons/fi";

import { LuLayoutDashboard } from "react-icons/lu";

import { AiOutlineTransaction } from "react-icons/ai";

import { RiPageSeparator, RiUserSettingsFill } from "react-icons/ri";

import { IoIosContact } from "react-icons/io";

export const menuItems = [
  {
    icon: LuLayoutDashboard,
    label: "Dashboard",
    href: "/admins/dashboard",
  },

  {
    icon: RiPageSeparator,
    label: "Payment",
    href: "/admins/dashboard/payment",
    subItems: [{ label: "Daftar Payment", href: "/admins/dashboard/payment" }],
  },

  {
    icon: AiOutlineTransaction,
    label: "Transaction",
    href: "/admins/dashboard/transaction",
    subItems: [
      {
        label: "Daftar Transaction",
        href: "/admins/dashboard/transaction",
      },
    ],
  },

  {
    icon: IoIosContact,
    label: "Contact",
    href: "/admins/dashboard/contact",
    subItems: [
      {
        label: "Daftar Contact",
        href: "/admins/dashboard/contact",
      },
    ],
  },

  {
    icon: RiUserSettingsFill,
    label: "Profile",
    href: "/admins/dashboard/profile",
  },

  {
    icon: FiHome,
    label: "Home",
    href: "/",
  },
];
