import api from "./api";

export interface ReservationMember {
  id: number;
  fullName: string;
  email: string;
  memberId?: string | null;
}

export interface ReservationBook {
  id: number;
  title: string;
  author: string;
  isbn: string;
  imageUrl?: string | null;
}

export interface ReservationRecord {
  id: number;
  member: ReservationMember;
  book: ReservationBook;
  reservedAt: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
}

export const createReservation = async (
  memberId: number,
  bookId: number,
): Promise<ReservationRecord> => {
  const response = await api.post<ReservationRecord>(
    "/reservations",
    { memberId, bookId },
  );

  return response.data;
};

export const getReservations =
  async (): Promise<ReservationRecord[]> => {
    const response =
      await api.get<ReservationRecord[]>(
        "/reservations",
      );

    return Array.isArray(response.data)
      ? response.data
      : [];
  };

export const cancelReservation =
  async (id: number) => {
    const response =
      await api.delete(
        `/reservations/${id}`,
      );

    return response.data;
  };

export const updateReservationStatus = async (
  id: number,
  status: "APPROVED" | "REJECTED",
): Promise<ReservationRecord> => {
  const response = await api.patch<ReservationRecord>(
    `/reservations/${id}/status`,
    { status },
  );

  return response.data;
};
