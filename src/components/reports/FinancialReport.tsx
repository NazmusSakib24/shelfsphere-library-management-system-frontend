import { Card, CardContent } from "@/components/ui/card";

import { FinesReport as FinesReportType } from "@/services/reports";

interface Props {
  data: FinesReportType;
}

export default function FinancialReport({
  data,
}: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <Card className="bg-[#FFFEFC]">
        <CardContent className="p-5">
          <p className="text-sm text-[#8C7B6B]">
            Total Fines
          </p>

          <p className="mt-2 text-2xl font-semibold text-[#2E211A]">
            ৳{data.totalFines.toFixed(2)}
          </p>
        </CardContent>
      </Card>

      <Card className="bg-[#FFFEFC]">
        <CardContent className="p-5">
          <p className="text-sm text-[#8C7B6B]">
            Paid Fines
          </p>

          <p className="mt-2 text-2xl font-semibold text-[#7C9A72]">
            ৳{data.paidFines.toFixed(2)}
          </p>
        </CardContent>
      </Card>

      <Card className="bg-[#FFFEFC]">
        <CardContent className="p-5">
          <p className="text-sm text-[#8C7B6B]">
            Unpaid Fines
          </p>

          <p className="mt-2 text-2xl font-semibold text-[#C96F4A]">
            ৳{data.unpaidFines.toFixed(2)}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}