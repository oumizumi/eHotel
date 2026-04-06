"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRole } from "@/components/RoleProvider";

export default function Navbar() {
  const path     = usePathname();
  const { role } = useRole();

  const customerLinks = [
    { href: "/customer/search",   label: "Search Rooms" },
    { href: "/customer/bookings", label: "My Bookings"  },
    { href: "/views",             label: "Reports"      },
  ];
  const employeeLinks = [
    { href: "/employee/checkin",  label: "Check-In"  },
    { href: "/employee/walkin",   label: "Walk-In"   },
    { href: "/employee/payment",  label: "Payments"  },
    { href: "/manage/customers",  label: "Customers" },
    { href: "/manage/employees",  label: "Employees" },
    { href: "/manage/hotels",     label: "Hotels"    },
    { href: "/manage/rooms",      label: "Rooms"     },
    { href: "/views",             label: "Reports"   },
  ];

  const links = role === "customer" ? customerLinks : employeeLinks;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-moss-800 h-14">
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center gap-6">

        <Link href="/" className="font-bold text-sm tracking-tight shrink-0 text-white hover:text-white/80 transition-colors">
          eHotels
        </Link>

        <div className="w-px h-4 bg-white/20 shrink-0" />

        <nav className="flex items-center">
          {links.map((link) => {
            const active = path.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`group relative px-4 h-14 flex items-center text-sm font-medium transition-colors ${
                  active ? "text-white" : "text-white/50 hover:text-white/90"
                }`}
              >
                {link.label}
                <span
                  className={`absolute bottom-2 left-4 right-4 h-[2px] rounded-full bg-white transition-all duration-200 ease-out ${
                    active
                      ? "opacity-70 scale-x-100"
                      : "opacity-0 scale-x-75 group-hover:opacity-40 group-hover:scale-x-100"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

      </div>
    </header>
  );
}
