"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRole } from "@/components/RoleProvider";

function useCountUp(target: number, duration = 1800, delay = 0) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    setValue(0);
    let frame: number;
    const timeout = setTimeout(() => {
      const start = performance.now();
      const step = (now: number) => {
        const p = Math.min((now - start) / duration, 1);
        setValue(Math.round((1 - Math.pow(1 - p, 3)) * target));
        if (p < 1) frame = requestAnimationFrame(step);
      };
      frame = requestAnimationFrame(step);
    }, delay);
    return () => { clearTimeout(timeout); cancelAnimationFrame(frame); };
  }, [target, duration, delay]);
  return value;
}

export default function LandingPage() {
  const { role, setRole } = useRole();

  const chains  = useCountUp(5,  1800, 200);
  const hotels  = useCountUp(44, 1800, 350);
  const cities  = useCountUp(9,  1800, 500);
  const rooms   = useCountUp(5,  1800, 650);

  return (
    <div className="min-h-[90vh] flex flex-col items-center justify-center gap-16 -mt-6 px-4" style={{ background: "#f9f7f4" }}>

      {/* Hero */}
      <div className="text-center max-w-3xl fade-up">
        <p className="text-xs font-semibold tracking-[0.18em] text-moss-600 uppercase mb-6">
          Five chains &nbsp;&middot;&nbsp; Nine cities &nbsp;&middot;&nbsp; North America
        </p>
        <h1 className="text-6xl font-bold text-moss-800 leading-[1.08] mb-6 tracking-tight">
          Your stay,<br />perfectly arranged.
        </h1>
        <p className="text-moss-700 text-lg leading-relaxed max-w-xl mx-auto">
          Real-time availability across 44 hotels. Book instantly,<br />manage everything from one place.
        </p>
      </div>

      {/* Role toggle + CTA */}
      <div className="flex flex-col items-center gap-5 fade-up" style={{ animationDelay: "150ms" }}>

        {/* Underline tab toggle */}
        <div className="flex gap-8">
          {(["customer", "employee"] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className="relative pb-2 text-sm font-semibold transition-colors duration-200"
              style={{ color: role === r ? "#3D4127" : "#9CA3AF" }}
            >
              {r === "customer" ? "Customer" : "Employee"}
              <span
                className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full transition-all duration-200"
                style={{
                  background: "#3D4127",
                  opacity: role === r ? 1 : 0,
                  transform: role === r ? "scaleX(1)" : "scaleX(0)",
                  transformOrigin: "center",
                }}
              />
            </button>
          ))}
        </div>

        {/* CTA */}
        <div className="flex gap-3">
          {role === "customer" ? (
            <Link href="/customer/search" className={btnPrimary}>Search Available Rooms</Link>
          ) : (
            <>
              <Link href="/employee/checkin" className={btnPrimary}>Guest Check-In</Link>
              <Link href="/employee/walkin"  className={btnSecondary}>Walk-In Renting</Link>
            </>
          )}
        </div>
      </div>

      {/* Stats with dividers */}
      <div className="fade-up w-full max-w-lg" style={{ animationDelay: "300ms" }}>
        <div className="flex items-center border-t border-moss-100 pt-10">
          {[
            { value: chains, label: "Chains"     },
            { value: hotels, label: "Hotels"     },
            { value: cities, label: "Cities"     },
            { value: rooms,  label: "Room Types" },
          ].map((stat, i) => (
            <div key={stat.label} className="flex flex-1 items-center">
              {i > 0 && <div className="w-px h-10 bg-moss-400 shrink-0" />}
              <div className="flex-1 text-center">
                <p className="text-5xl font-bold text-moss-800 tabular-nums leading-none">{stat.value}</p>
                <p className="text-xs text-moss-600 mt-3 font-medium uppercase tracking-widest">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

const btnPrimary =
  "inline-flex items-center bg-moss-800 text-white hover:text-white text-sm font-semibold px-7 py-3 rounded-xl transition-colors duration-200 hover:bg-moss-700 no-underline focus:outline-none";

const btnSecondary =
  "inline-flex items-center text-moss-800 text-sm font-semibold px-7 py-3 rounded-xl transition-all duration-200 opacity-70 hover:opacity-100 hover:underline underline-offset-4";
