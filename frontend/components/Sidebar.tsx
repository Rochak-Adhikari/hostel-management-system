"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  User,
  Bed,
  CreditCard,
  MessageSquareWarning,
  Bell,
  Users,
  Settings,
  LogOut,
} from "lucide-react";

const navLinks = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "My Profile", href: "/my-profile", icon: User },
  { name: "My Room", href: "/my-room", icon: Bed },
  { name: "Fee & Payments", href: "/fees", icon: CreditCard },
  { name: "My Complaints", href: "/complaints", icon: MessageSquareWarning },
  { name: "Notices", href: "/notices", icon: Bell },
  { name: "Visitor Log", href: "/visitor-log", icon: Users },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-35 h-screen bg-white border border-black shadow-[0px_4px_4px_rgba(0,0,0,0.25)] flex flex-col justify-between shrink-0">
      
      {/* Logo */}
      <div>
        <div className="flex justify-center pt-3 pb-2">
          <Image
            src="/assets/logo.png"
            alt="HostelHub Logo"
            width={90}
            height={28}
          />
        </div>

        {/* Nav links */}
        <nav className="flex flex-col gap-6 mt-4 px-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 text-xs font-bold font-poppins leading-3 ${
                  isActive ? "text-black font-semibold" : "text-black/70"
                }`}
              >
                <Icon size={16} strokeWidth={1.5} />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom: Settings + Log Out */}
      <div className="flex flex-col gap-3 px-2 pb-6">
        <Link
          href="/settings"
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