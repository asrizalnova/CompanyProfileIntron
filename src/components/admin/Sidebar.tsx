"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { logout } from "@/app/admin/(panel)/actions";

import {
  LayoutDashboard,
  Settings,
  BriefcaseBusiness,
  ClipboardList,
  FolderKanban,
  Users,
  MessageSquareQuote,
  Handshake,
  ChartNoAxesColumnIncreasing,
  Newspaper,
  UserRound,
  ExternalLink,
  LogOut,
  ChevronLeft,
  Menu,
  X,
  type LucideIcon,
} from "lucide-react";

type Item = {
  href: string;
  label: string;
  badge?: number;
  icon: LucideIcon;
};

function isActive(pathname: string, href: string) {
  return href === "/admin"
    ? pathname === "/admin"
    : pathname === href || pathname.startsWith(`${href}/`);
}

export function Sidebar({
  adminName,
  unread,
}: {
  adminName: string;
  unread: number;
}) {
  const pathname = usePathname();
  const [openAt, setOpenAt] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState(false);

  const mobileOpen = openAt === pathname;

  const groups: { title: string; items: Item[] }[] = [
    {
      title: "Umum",
      items: [
        { href: "/admin", label: "Ringkasan", icon: LayoutDashboard },
        { href: "/admin/pengaturan", label: "Pengaturan situs", icon: Settings },
      ],
    },
    {
      title: "Konten",
      items: [
        { href: "/admin/program", label: "Program", icon: BriefcaseBusiness },
        { href: "/admin/tim", label: "Tim", icon: Users },
        { href: "/admin/pendaftaran", label: "Pendaftaran Batch", icon: ClipboardList },
        { href: "/admin/testimoni", label: "Testimoni", icon: MessageSquareQuote },
        { href: "/admin/mitra", label: "Klien dan mitra", icon: Handshake },
        { href: "/admin/statistik", label: "Angka perusahaan", icon: ChartNoAxesColumnIncreasing },
        { href: "/admin/artikel", label: "Artikel", icon: Newspaper },
        { href: "/admin/galeri", label: "Galeri Kegiatan", icon: Newspaper },
        { href: "/admin/unduh-berkas", label: "Berkas Calon Siswa", icon: Newspaper },
      ],
    },
    {
      title: "Kotak masuk",
      items: [
        { href: "/admin/pesan", label: "Pesan masuk", badge: unread, icon: MessageSquareQuote },
      ],
    },
  ];

  const nav = (
    <nav
      aria-label="Menu admin"
      className="sidebar-scroll min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-3 py-4"
    >
      {groups.map((group) => (
        <div key={group.title} className="mb-6">
          {!collapsed && (
            <p className="px-3 pb-2 text-sm text-white/55">
              {group.title}
            </p>
          )}
          <ul className="space-y-0.5">
            {group.items.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    title={collapsed ? item.label : undefined}
                    aria-label={item.label}
                    aria-current={active ? "page" : undefined}
                    onClick={() => setOpenAt(null)} 
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-[0.95rem] transition-colors ${
                      active
                        ? "bg-white/12 font-semibold text-white"
                        : "text-white/75 hover:bg-white/8 hover:text-white"
                    } ${collapsed ? "justify-center px-0" : "justify-between"}`}
                  >
                    <span className={`flex min-w-0 items-center ${collapsed ? "justify-center" : "gap-3"}`}>
                      <item.icon
                        size={19}
                        strokeWidth={1.8}
                        className={`shrink-0 ${active ? "text-kunyit" : "text-white/65"}`}
                        aria-hidden="true"
                      />
                      {!collapsed && <span className="truncate">{item.label}</span>}
                    </span>
                    {item.badge ? (
                      <span className="shrink-0 rounded-full bg-kunyit px-2 py-0.5 text-xs font-bold text-ink">
                        {item.badge}
                        <span className="sr-only"> belum dibaca</span>
                      </span>
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );

  const footer = (
    <div className="shrink-0 border-t border-white/15 px-3 py-4">
      <Link
        href="/admin/akun"
        onClick={() => setOpenAt(null)}
        title={collapsed ? `Akun: ${adminName}` : undefined}
        aria-current={isActive(pathname, "/admin/akun") ? "page" : undefined}
        className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-[0.95rem] text-white/80 hover:bg-white/8 hover:text-white ${
          collapsed ? "justify-center px-0" : ""
        }`}
      >
        <UserRound size={19} className="shrink-0" />
        {!collapsed && <span className="truncate">Akun: {adminName}</span>}
      </Link>

      <a
        href="/"
        target="_blank"
        rel="noopener noreferrer"
        title={collapsed ? "Lihat situs" : undefined}
        className="block truncate rounded-sm px-3 py-2 text-[0.95rem] text-white/80 hover:bg-white/8 hover:text-white"
      >
        {collapsed ? "↗" : "Lihat situs"}
      </a>

      <form action={logout}>
        <button
          type="submit"
          title={collapsed ? "Keluar" : undefined}
          className="block w-full truncate rounded-sm px-3 py-2 text-left text-[0.95rem] text-white/80 hover:bg-white/8 hover:text-white"
        >
          {collapsed ? "↪" : "Keluar"}
        </button>
      </form>
    </div>
  );

  const brand = (
    <div className="relative shrink-0 border-b border-white/10">
      <Link
        href="/admin"
        onClick={() => setOpenAt(null)}
        className={`flex flex-col items-center gap-3 text-white ${
          collapsed ? "px-2 py-7" : "px-5 py-7 pr-10"
        }`}
      >
        <Image
          src="/logoputih.png"
          alt="Logo perusahaan"
          width={400}
          height={400}
          priority
          unoptimized
          className={`shrink-0 object-contain transition-all duration-300 ${
            collapsed ? "h-12 w-12" : "h-20 w-20"
          }`}
        />
        {!collapsed && (
          <span className="text-center text-sm font-medium tracking-wide text-white/70">
            Panel admin
          </span>
        )}
      </Link>

      <button
        type="button"
        onClick={() => setCollapsed((value) => !value)}
        aria-label={collapsed ? "Tampilkan sidebar" : "Sembunyikan sidebar"}
        aria-expanded={!collapsed}
        title={collapsed ? "Tampilkan sidebar" : "Sembunyikan sidebar"}
        className="absolute right-2 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-md text-white/70 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`}
          aria-hidden="true"
        >
          <path d="m15 18-6-6 6-6" />
          <path d="M19 6v12" />
        </svg>
      </button>
    </div>
  );

  return (
    <>
      {/* DESKTOP SIDEBAR */}
      {/* Menggunakan h-full agar mengisi parent (yang sudah fixed di layout) */}
      <aside
        className={`on-dark hidden h-full shrink-0 flex-col bg-ink transition-[width] duration-300 md:flex ${
          collapsed ? "w-20" : "w-64"
        }`}
      >
        {brand}
        {nav}
        {footer}
      </aside>

      {/* MOBILE HEADER */}
      <div className="on-dark sticky top-0 z-30 bg-ink md:hidden">
        <div className="flex items-center justify-between pr-4">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 text-white">
            <Image
              src="/logoputih.png"
              alt="Logo perusahaan"
              width={400}
              height={400}
              priority
              unoptimized
              className="h-12 w-12 shrink-0 object-contain"
            />
            <span className="text-sm font-medium text-white/70">
              Panel admin
            </span>
          </Link>

          <button
            type="button"
            aria-label={mobileOpen ? "Tutup menu" : "Buka menu"}
            aria-expanded={mobileOpen}
            aria-controls="menu-admin-seluler"
            onClick={() => setOpenAt(mobileOpen ? null : pathname)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-white transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            {mobileOpen ? <X size={26} strokeWidth={2} /> : <Menu size={26} strokeWidth={2} />}
          </button>
        </div>
      </div>

      {/* MOBILE OVERLAY SIDEBAR */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex flex-col md:hidden">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
            onClick={() => setOpenAt(null)}
            aria-hidden="true"
          />
          <div 
            id="menu-admin-seluler"
            className="on-dark relative flex h-full w-[85%] max-w-sm flex-col bg-ink shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-4">
              <Link href="/admin" onClick={() => setOpenAt(null)} className="flex items-center gap-3 text-white">
                <Image
                  src="/logoputih.png"
                  alt="Logo"
                  width={400}
                  height={400}
                  priority
                  unoptimized
                  className="h-10 w-10 shrink-0 object-contain"
                />
                <span className="text-sm font-medium text-white/70">Panel admin</span>
              </Link>
              <button
                type="button"
                onClick={() => setOpenAt(null)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-white/70 hover:bg-white/10 hover:text-white"
                aria-label="Tutup menu"
              >
                <X size={24} />
              </button>
            </div>
            <div className="flex flex-1 flex-col overflow-hidden">
              {nav}
              {footer}
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .sidebar-scroll {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .sidebar-scroll::-webkit-scrollbar {
          display: none;
          width: 0;
          height: 0;
        }
      `}</style>
    </>
  );
}