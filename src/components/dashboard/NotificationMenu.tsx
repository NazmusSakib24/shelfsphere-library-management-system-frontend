"use client";

import { useState } from "react";
import { FiBell } from "react-icons/fi";

import { useAuth } from "@/context/AuthContext";
import { getReservations, type ReservationRecord } from "@/services/reservations";

export default function NotificationMenu() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reservations, setReservations] = useState<ReservationRecord[]>([]);

  const toggle = async () => {
    setOpen((value) => !value);
    if (open) return;
    try {
      setLoading(true);
      setReservations(await getReservations());
    } finally {
      setLoading(false);
    }
  };

  const notifications = user?.role === "MEMBER"
    ? reservations.filter((item) => item.status !== "PENDING")
    : reservations.filter((item) => item.status === "PENDING");

  return <div className="relative"><button onClick={toggle} aria-label="Notifications" className="relative flex h-10 w-10 items-center justify-center rounded-full text-[#6B5B4D] hover:bg-[#F3EAE0]"><FiBell className="text-xl" />{notifications.length > 0 && <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#B23B2E]" />}</button>{open && <div className="absolute right-0 top-12 w-80 rounded-xl border border-[#E8DCC8] bg-white p-3 shadow-lg"><p className="px-2 pb-2 text-sm font-bold text-[#4A362A]">Notifications</p>{loading ? <p className="p-2 text-sm text-[#8A7567]">Loading...</p> : notifications.length === 0 ? <p className="p-2 text-sm text-[#8A7567]">No new notifications.</p> : <div className="max-h-72 space-y-1 overflow-y-auto">{notifications.map((item) => <div key={item.id} className="rounded-lg p-2.5 text-sm hover:bg-[#F8F1E7]"><p className="font-medium text-[#4A362A]">{user?.role === "MEMBER" ? `Your request for ${item.book.title} is ${item.status.toLowerCase()}.` : `${item.member.fullName} requested ${item.book.title}.`}</p><p className="mt-1 text-xs text-[#8A7567]">{new Date(item.reservedAt).toLocaleDateString()}</p></div>)}</div>}</div>}</div>;
}
