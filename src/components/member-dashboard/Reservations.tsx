"use client";

import {
  FaBookmark,
  FaCalendarAlt,
} from "react-icons/fa";

import { MemberReservation } from "@/services/member-dashboard";

interface ReservationsProps {
  reservations: MemberReservation[];
}

export default function Reservations({
  reservations,
}: ReservationsProps) {
  return (
    <section
      id="reservations"
      className="rounded-2xl border border-[#EFE5D8] bg-[#FFFDF9] shadow-sm"
    >
      <div className="flex items-center justify-between border-b border-[#EFE5D8] p-6">
        <div>
          <h2 className="text-lg font-bold text-[#4A362A]">
            My Reservations
          </h2>

          <p className="mt-1 text-sm text-[#8A7567]">
            Books you have reserved
          </p>
        </div>

        <FaBookmark
          className="text-[#6B7A4F]"
          size={19}
        />
      </div>

      {reservations.length === 0 ? (
        <div className="p-10 text-center">
          <FaBookmark
            className="mx-auto mb-3 text-[#CDBEAF]"
            size={30}
          />

          <p className="font-medium text-[#6D594C]">
            No reservations
          </p>

          <p className="mt-1 text-sm text-[#9B8778]">
            Your reserved books will appear here.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-[#EFE5D8]">
          {reservations.map((reservation) => (
            <div
              key={reservation.id}
              className="flex items-center justify-between p-5 transition hover:bg-[#FCF6EF]"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#E8EBD9]">
                  <FaBookmark
                    className="text-[#6B7A4F]"
                    size={15}
                  />
                </div>

                <div>
                  <h3 className="font-medium text-[#4A362A]">
                    {reservation.book.title}
                  </h3>

                  {reservation.book.author && (
                    <p className="text-sm text-[#8A7567]">
                      {reservation.book.author}
                    </p>
                  )}
                </div>
              </div>

              <div className="text-right text-xs text-[#8A7567]">
                <div className="flex items-center gap-1">
                  <FaCalendarAlt size={11} />

                  {new Date(
                    reservation.reservedAt,
                  ).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}