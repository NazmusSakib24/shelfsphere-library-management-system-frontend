"use client";

import { useEffect, useState } from "react";
import { isAxiosError } from "axios";
import {
  FiBookOpen,
  FiCheck,
  FiCalendar,
  FiMail,
  FiX,
  FiUser,
} from "react-icons/fi";

import {
  getReservations,
  ReservationRecord,
  updateReservationStatus,
} from "@/services/reservations";

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<
    ReservationRecord[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadReservations = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getReservations();
      setReservations(data);
    } catch (error: unknown) {
      console.error("Reservations error:", error);

      if (
        isAxiosError(error) &&
        error.response?.status === 403
      ) {
        setError(
          "You do not have permission to view reservations."
        );
      } else {
        setError("Failed to load reservations.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReservations();
  }, []);

  const handleDecision = async (
    id: number,
    status: "APPROVED" | "REJECTED",
  ) => {
    try {
      setError("");
      const updatedReservation =
        await updateReservationStatus(id, status);

      setReservations((currentReservations) =>
        currentReservations.map((reservation) =>
          reservation.id === id
            ? updatedReservation
            : reservation,
        ),
      );
    } catch (error: unknown) {
      console.error("Reservation decision error:", error);
      setError("Failed to update the reservation status.");
    }
  };

  const totalBooks = new Set(
    reservations.map((reservation) => reservation.book.id)
  ).size;

  const totalMembers = new Set(
    reservations.map(
      (reservation) => reservation.member.id
    )
  ).size;

  return (
    <div className="min-h-screen bg-[#FAF3E9]">
      <main className="px-8 pb-10 pt-8">
        <div className="p-8">

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#2E211A]">
              Reservations
            </h1>

            <p className="mt-2 text-sm text-[#8C7B6B]">
              Review and manage book reservation requests from members
            </p>
          </div>

          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="mb-6 grid gap-5 md:grid-cols-3">

            <div className="rounded-xl border border-[#E5D8C8] bg-[#FFFDF9] p-5">
              <p className="text-sm text-[#8C7B6B]">
                Total Reservations
              </p>

              <p className="mt-2 text-2xl font-bold text-[#2E211A]">
                {loading ? "..." : reservations.length}
              </p>
            </div>

            <div className="rounded-xl border border-[#E5D8C8] bg-[#FFFDF9] p-5">
              <p className="text-sm text-[#8C7B6B]">
                Reserved Books
              </p>

              <p className="mt-2 text-2xl font-bold text-[#6B7A4F]">
                {loading ? "..." : totalBooks}
              </p>
            </div>

            <div className="rounded-xl border border-[#E5D8C8] bg-[#FFFDF9] p-5">
              <p className="text-sm text-[#8C7B6B]">
                Members
              </p>

              <p className="mt-2 text-2xl font-bold text-[#B08828]">
                {loading ? "..." : totalMembers}
              </p>
            </div>

          </div>

          <div className="rounded-2xl border border-[#E5D8C8] bg-[#FFFDF9]">

            <div className="border-b border-[#E5D8C8] p-6">
              <div className="flex items-center gap-3">
                <FiBookOpen
                  className="text-[#6B7A4F]"
                  size={20}
                />

                <div>
                  <h2 className="text-lg font-bold text-[#2E211A]">
                    Reservation List
                  </h2>

                  <p className="mt-1 text-sm text-[#8C7B6B]">
                    Current reservations from members
                  </p>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="p-10 text-center text-sm text-[#8C7B6B]">
                Loading reservations...
              </div>
            ) : reservations.length === 0 ? (
              <div className="p-10 text-center">
                <FiBookOpen
                  className="mx-auto mb-3 text-[#CDBEAF]"
                  size={30}
                />

                <p className="font-medium text-[#4A362A]">
                  No reservations found
                </p>

                <p className="mt-1 text-sm text-[#8C7B6B]">
                  Reservations will appear here.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#E5D8C8] bg-[#F8F1E7] text-left">
                      <th className="px-6 py-4 text-sm font-semibold text-[#6D594C]">
                        Member
                      </th>

                      <th className="px-6 py-4 text-sm font-semibold text-[#6D594C]">
                        Book
                      </th>

                      <th className="px-6 py-4 text-sm font-semibold text-[#6D594C]">
                        Reserved On
                      </th>

                      <th className="px-6 py-4 text-sm font-semibold text-[#6D594C]">
                        Status
                      </th>

                      <th className="px-6 py-4 text-right text-sm font-semibold text-[#6D594C]">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {reservations.map((reservation) => (
                      <tr
                        key={reservation.id}
                        className="border-b border-[#EFE5D8] hover:bg-[#FCF7F0]"
                      >
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E8EBD9]">
                              <FiUser
                                className="text-[#6B7A4F]"
                                size={15}
                              />
                            </div>

                            <div>
                              <p className="font-medium text-[#4A362A]">
                                {reservation.member.fullName}
                              </p>

                              <div className="mt-1 flex items-center gap-1 text-xs text-[#8C7B6B]">
                                <FiMail size={11} />

                                {reservation.member.email}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-5">
                          <p className="font-medium text-[#4A362A]">
                            {reservation.book.title}
                          </p>

                          <p className="mt-1 text-sm text-[#8C7B6B]">
                            {reservation.book.author}
                          </p>
                        </td>

                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2 text-sm text-[#6D594C]">
                            <FiCalendar size={14} />

                            {new Date(
                              reservation.reservedAt
                            ).toLocaleDateString()}
                          </div>
                        </td>

                        <td className="px-6 py-5">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              reservation.status === "APPROVED"
                                ? "bg-[#E5EBD9] text-[#59683E]"
                                : reservation.status === "REJECTED"
                                  ? "bg-[#F6DEDA] text-[#B23B2E]"
                                  : "bg-[#F7F0DD] text-[#A47A19]"
                            }`}
                          >
                            {reservation.status.charAt(0) +
                              reservation.status.slice(1).toLowerCase()}
                          </span>
                        </td>

                        <td className="px-6 py-5 text-right">
                          {reservation.status === "PENDING" ? (
                            <div className="inline-flex gap-2">
                              <button
                                type="button"
                                onClick={() => handleDecision(reservation.id, "APPROVED")}
                                className="inline-flex items-center gap-1.5 rounded-lg bg-[#6B7A4F] px-3 py-2 text-sm font-medium text-white hover:bg-[#59683E]"
                              >
                                <FiCheck size={14} />
                                Confirm
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDecision(reservation.id, "REJECTED")}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                              >
                                <FiX size={14} />
                                Reject
                              </button>
                            </div>
                          ) : (
                            <span className="text-sm text-[#8C7B6B]">Reviewed</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

          </div>
        </div>
      </main>
    </div>
  );
}
