"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  BedDouble,
  CreditCard,
  MessageSquareWarning,
  UserRoundCheck,
  Bell,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";

const navLinks = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Students", href: "/admin/students", icon: Users },
  { name: "Rooms", href: "/admin/rooms", icon: BedDouble },
  { name: "Payments", href: "/admin/payments", icon: CreditCard },
  { name: "Complaints", href: "/admin/complaints", icon: MessageSquareWarning },
  { name: "Visitors", href: "/admin/visitors", icon: UserRoundCheck },
  { name: "Notices", href: "/admin/notices", icon: Bell },
  { name: "Reports", href: "/admin/reports", icon: BarChart3 },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-44 h-screen bg-white border border-black shadow-[0px_4px_4px_rgba(0,0,0,0.25)] flex flex-col justify-between shrink-0">
      <div>
        {/* Logo */}
        <div className="flex justify-center pt-3 pb-2">
          <Image
            src="/assets/logo.png"
            alt="HostelHub Logo"
            width={90}
            height={28}
          />
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-6 mt-4 px-3">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 text-xs font-bold leading-3 ${
                  isActive ? "text-black" : "text-black/70"
                }`}
              >
                <Icon size={16} strokeWidth={1.5} />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom */}
      <div className="flex flex-col gap-3 px-3 pb-6">
        <Link
          href="/admin/settings"
          className="flex items-center gap-2 text-[10px] font-medium text-black/70"
        >
          <Settings size={16} strokeWidth={1.5} />
          <span>Settings</span>
        </Link>

        <Link
          href="/login"
          className="flex items-center gap-2 text-[10px] font-medium text-black/70"
        >
          <LogOut size={16} strokeWidth={1.5} />
          <span>Log Out</span>
        </Link>
      </div>
    </aside>
  );
}