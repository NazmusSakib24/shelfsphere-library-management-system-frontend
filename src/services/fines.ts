
import api from "@/services/api";
import { Fine } from "@/types/fine";

export const getFines = async (): Promise<Fine[]> => {
  const response = await api.get<Fine[]>("/fines");

  return response.data;
};

export const createFine = async (
  borrowRecordId: number,
  amount: number,
): Promise<Fine> => {
  const response = await api.post<Fine>("/fines", {
    borrowRecordId,
    amount,
  });

  return response.data;
};

export const payFine = async (
  fineId: number,
): Promise<Fine> => {
  const response = await api.patch<Fine>(
    `/fines/${fineId}/pay`,
  );

  return response.data;
};
