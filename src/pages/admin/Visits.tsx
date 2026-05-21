import {useState} from "react";
import {useRequests} from "../../hooks/useRequests";
import {useTranslation} from "../../i18n";
import {Card} from "../../components/ui/Card";
import {StatusBadge} from "../../components/shared/StatusBadge";
import {Input} from "../../components/ui/Input";
import {format} from "date-fns";
import {Search} from "lucide-react";
import {useDateFormat} from "../../hooks/useDateFormat";

export const Visits = () => {
  const {t} = useTranslation();
  const {formatDate, formatTime} = useDateFormat();
  const [searchQuery, setSearchQuery] = useState("");

  const {requests, loading} = useRequests({searchQuery, sortBy: "date"});

  if (loading) return <div>{t("admin.loading" as any) as string}</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">
        {t("admin.visitsHistory" as any) as string}
      </h1>

      <Card className="p-0 overflow-hidden">
        <div className="p-4 border-b bg-gray-50 flex flex-wrap gap-4 items-center justify-between">
          <div className="relative w-full sm:w-64">
            <Search
              className="absolute start-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <Input
              placeholder={t("admin.searchSchool" as any) as string}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-9 bg-white"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-start text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 font-medium text-gray-500 text-start">
                  {t("admin.school" as any) as string}
                </th>
                <th className="px-6 py-4 font-medium text-gray-500 text-start">
                  {t("admin.date" as any) as string}
                </th>
                <th className="px-6 py-4 font-medium text-gray-500 text-start">
                  {t("form.preferredTime" as any) as string}
                </th>
                <th className="px-6 py-4 font-medium text-gray-500 text-start">
                  {t("form.numberOfStudents" as any) as string}
                </th>
                <th className="px-6 py-4 font-medium text-gray-500 text-start">
                  {t("admin.status" as any) as string}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {requests.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-start">
                    {r.schoolName}
                  </td>
                  <td className="px-6 py-4 text-start">
                    {r.confirmedDate
                      ? formatDate(r.confirmedDate.toDate(), "PPP")
                      : r.preferredDate
                        ? formatDate(r.preferredDate.toDate(), "PPP")
                        : "-"}
                  </td>
                  <td className="px-6 py-4 text-start">
                    {formatTime(r.confirmedTime || r.preferredTime)}
                  </td>
                  <td className="px-6 py-4 text-start">{r.numberOfStudents}</td>
                  <td className="px-6 py-4 text-start">
                    <StatusBadge status={r.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 bg-gray-50 border-t text-sm text-gray-500 text-center">
          Showing {requests.length} visits
        </div>
      </Card>
    </div>
  );
};
