"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { navItems } from "./nav-items";

type ProgramNavItem = {
  title: string;
  slug: string;
};

type GalleryNavItem = {
  title: string;
  slug: string;
};

type NavItem = {
  href: string;
  label: string;
  children?: {
    href: string;
    label: string;
  }[];
};

function isActive(pathname: string, href: string) {
  return href === "/"
    ? pathname === "/"
    : pathname === href || pathname.startsWith(`${href}/`);
}

function createNavItems(
  programs: ProgramNavItem[],
  galleries: GalleryNavItem[],
): NavItem[] {
  return navItems.map((item) => {
    if (item.href === "/program") {
      return {
        ...item,
        children: programs.map((program) => ({
          href: `/program/${program.slug}`,
          label: program.title,
        })),
      };
    }

    if (item.href === "/galeri") {
      return {
        ...item,
        children: galleries.map((gallery) => ({
          href: `/galeri/${gallery.slug}`,
          label: gallery.title,
        })),
      };
    }

    return item;
  });
}

export function DesktopNav({
  programs,
  galleries,
}: {
  programs: ProgramNavItem[];
  galleries: GalleryNavItem[];
}) {
  const pathname = usePathname();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const items = createNavItems(programs, galleries);

  return (
    <nav
      aria-label="Navigasi utama"
      className="hidden items-center gap-6 lg:flex"
    >
      {items.slice(0, -1).map((item) => {
        const active = isActive(pathname, item.href);
        const dropdownOpen = openDropdown === item.href;

        // Kelas CSS dasar untuk animasi garis bawah (sliding underline)
        const linkClasses = `relative py-1.5 text-[13px] font-medium tracking-wide transition-colors duration-300 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-kunyit after:transition-transform after:duration-300 hover:after:origin-bottom-left hover:after:scale-x-100 ${
          active
            ? "text-ink font-semibold after:scale-x-100 after:origin-bottom-left"
            : "text-muted hover:text-ink"
        }`;

        if (item.children) {
          return (
            <div
              key={item.href}
              className="relative group"
              onMouseEnter={() => setOpenDropdown(item.href)}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <div className="flex items-center gap-1">
                <Link
                  href={item.href}
                  aria-current={
                    pathname === item.href ? "page" : undefined
                  }
                  className={linkClasses}
                >
                  {item.label}
                </Link>

                <button
                  type="button"
                  aria-label={`Buka submenu ${item.label}`}
                  aria-expanded={dropdownOpen}
                  onClick={() =>
                    setOpenDropdown((prev) =>
                      prev === item.href ? null : item.href,
                    )
                  }
                  className="p-0.5 text-muted transition-colors group-hover:text-ink"
                >
                  <svg
                    className={`h-3.5 w-3.5 transition-transform duration-300 ${
                      dropdownOpen ? "rotate-180" : ""
                    }`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    aria-hidden="true"
                  >
                    <path
                      d="m6 9 6 6 6-6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>

              {dropdownOpen && (
                <div className="absolute left-0 top-full z-50 w-64 pt-3">
                  {/* Dropdown dengan shadow halus dan efek frosted glass */}
                  <div className="max-h-80 overflow-y-auto rounded-xl border border-line/80 bg-paper/95 py-2 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] backdrop-blur-md">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={() => setOpenDropdown(null)}
                        className="block px-4 py-2.5 text-[13px] text-muted transition-all duration-200 hover:bg-line/30 hover:pl-5 hover:text-ink"
                      >
                        {child.label}
                      </Link>
                    ))}

                    {item.children.length === 0 && (
                      <p className="px-4 py-3 text-[13px] text-muted">
                        {item.href === "/program"
                          ? "Belum ada program tersedia."
                          : "Belum ada album galeri tersedia."}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        }

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={linkClasses}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function MobileMenu({
  programs,
  galleries,
}: {
  programs: ProgramNavItem[];
  galleries: GalleryNavItem[];
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const items = createNavItems(programs, galleries);

  function closeMenu() {
    setOpen(false);
    setOpenDropdown(null);
  }

  return (
    <div className="relative z-50 lg:hidden">
      <button
        type="button"
        aria-label={open ? "Tutup menu navigasi" : "Buka menu navigasi"}
        aria-expanded={open}
        aria-controls="menu-seluler"
        onClick={() => {
          setOpen((prev) => !prev);
          setOpenDropdown(null);
        }}
        className="relative z-50 inline-flex h-10 w-10 touch-manipulation items-center justify-center rounded-full text-ink transition-colors hover:bg-line/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kunyit"
      >
        <span className="sr-only">
          {open ? "Tutup menu" : "Buka menu"}
        </span>

        <span className="relative flex h-4 w-5 flex-col items-center justify-center">
          <span
            className={`absolute h-[2px] w-5 rounded-full bg-current transition-all duration-300 ${
              open ? "translate-y-0 rotate-45" : "-translate-y-1.5"
            }`}
          />
          <span
            className={`absolute h-[2px] w-5 rounded-full bg-current transition-all duration-300 ${
              open ? "scale-x-0 opacity-0" : "scale-x-100 opacity-100"
            }`}
          />
          <span
            className={`absolute h-[2px] w-5 rounded-full bg-current transition-all duration-300 ${
              open ? "translate-y-0 -rotate-45" : "translate-y-1.5"
            }`}
          />
        </span>
      </button>

      {open && (
        <nav
          id="menu-seluler"
          aria-label="Navigasi seluler"
          className="absolute right-0 top-full z-50 mt-3 w-[min(90vw,20rem)] rounded-xl border border-line bg-paper px-5 pb-5 pt-3 shadow-xl"
        >
          <ul>
            {items.map((item) => {
              const active = isActive(pathname, item.href);
              const dropdownOpen = openDropdown === item.href;

              return (
                <li
                  key={item.href}
                  className="border-b border-line/50 last:border-0"
                >
                  {item.children ? (
                    <>
                      <div className="flex items-center">
                        <Link
                          href={item.href}
                          onClick={closeMenu}
                          aria-current={
                            pathname === item.href ? "page" : undefined
                          }
                          className={`flex-1 py-3 text-[14px] transition-colors ${
                            active
                              ? "font-semibold text-ink"
                              : "text-muted hover:text-ink"
                          }`}
                        >
                          {item.label}
                        </Link>

                        <button
                          type="button"
                          aria-label={`Buka submenu ${item.label}`}
                          aria-expanded={dropdownOpen}
                          onClick={() =>
                            setOpenDropdown((prev) =>
                              prev === item.href ? null : item.href,
                            )
                          }
                          className="p-3 text-muted hover:text-ink"
                        >
                          <svg
                            className={`h-4 w-4 transition-transform duration-300 ${
                              dropdownOpen ? "rotate-180" : ""
                            }`}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            aria-hidden="true"
                          >
                            <path
                              d="m6 9 6 6 6-6"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                      </div>

                      {dropdownOpen && (
                        <ul className="pb-2 pl-3">
                          <li>
                            <Link
                              href={item.href}
                              onClick={closeMenu}
                              className="block py-2.5 text-[13px] font-semibold text-ink"
                            >
                              Lihat Semua {item.label}
                            </Link>
                          </li>

                          {item.children.map((child) => (
                            <li key={child.href}>
                              <Link
                                href={child.href}
                                onClick={closeMenu}
                                className="block py-2.5 text-[13px] text-muted transition-colors hover:text-ink"
                              >
                                {child.label}
                              </Link>
                            </li>
                          ))}

                          {item.children.length === 0 && (
                            <li className="py-2.5 text-[13px] text-muted">
                              {item.href === "/program"
                                ? "Belum ada program tersedia."
                                : "Belum ada album galeri tersedia."}
                            </li>
                          )}
                        </ul>
                      )}
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      onClick={closeMenu}
                      className={`block py-3 text-[14px] transition-colors ${
                        active
                          ? "font-semibold text-ink"
                          : "text-muted hover:text-ink"
                      }`}
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </div>
  );
}