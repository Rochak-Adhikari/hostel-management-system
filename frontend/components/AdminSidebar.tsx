"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
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
  Menu,
  X,
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
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile top bar — visible only below lg */}
      <div className="lg:hidden fixed top-0 inset-x-0 z-40 h-14 flex items-center justify-between px-4 bg-white border-b border-black">
        <Image
          src="/HostelHubLOGO-removebg-preview.png"
          alt="HostelHub Logo"
          width={90}
          height={28}
          className="object-contain"
        />
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open navigation menu"
          className="p-1 rounded focus-visible:outline-2 focus-visible:outline-black"
        >
          <Menu size={22} />
        </button>
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 z-40"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={[
          "fixed inset-y-0 left-0 z-50",
          "lg:static lg:z-auto lg:translate-x-0",
          "w-64 lg:w-44 h-screen",
          "flex flex-col",
          "bg-white border border-black",
          "shadow-[0px_4px_4px_rgba(0,0,0,0.25)]",
          "transition-transform duration-200 ease-in-out",
          "shrink-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        {/* Desktop: centered logo */}
        <div className="hidden lg:flex justify-center pt-3 pb-2">
          <Image
            src="/HostelHubLOGO-removebg-preview.png"
            alt="HostelHub Logo"
            width={90}
            height={28}
            className="object-contain"
          />
        </div>

        {/* Mobile: logo + close button */}
        <div className="flex lg:hidden items-center justify-between px-4 pt-4 pb-3 border-b border-black">
          <Image
            src="/HostelHubLOGO-removebg-preview.png"
            alt="HostelHub Logo"
            width={90}
            height={28}
            className="object-contain"
          />
          <button
            onClick={() => setIsOpen(false)}
            aria-label="Close navigation menu"
            className="p-1 rounded focus-visible:outline-2 focus-visible:outline-black"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-6 mt-4 px-3 flex-1" aria-label="Admin navigation">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-2 text-xs font-bold leading-3 transition-opacity ${
                  isActive ? "text-black" : "text-black/60 hover:text-black"
                }`}
              >
                <Icon size={16} strokeWidth={1.5} />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="flex flex-col gap-3 px-3 pb-6">
          <Link
            href="/admin/settings"
            className="flex items-center gap-2 text-xs font-medium text-black/60 hover:text-black"
          >
            <Settings size={16} strokeWidth={1.5} />
            <span>Settings</span>
          </Link>
          <Link
            href="/login"
            className="flex items-center gap-2 text-xs font-medium text-black/60 hover:text-black"
          >
            <LogOut size={16} strokeWidth={1.5} />
            <span>Log Out</span>
          </Link>
        </div>
      </aside>
    </>
  );
}
