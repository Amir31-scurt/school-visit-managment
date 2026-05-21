import {useState} from "react";
import {useRequests} from "../../hooks/useRequests";
import {useTranslation} from "../../i18n";
import {Card} from "../../components/ui/Card";
import {StatusBadge} from "../../components/shared/StatusBadge";
import {Input} from "../../components/ui/Input";
import {Button} from "../../components/ui/Button";
import {format} from "date-fns";
import {Search, MessageCircle} from "lucide-react";
import {buildWhatsAppLink} from "../../lib/whatsapp";
import {ApproveModal} from "../../components/ApproveModal";
import {RejectModal} from "../../components/RejectModal";
import {VisitRequest} from "../../types";
import {useDateFormat} from "../../hooks/useDateFormat";

export const Requests = () => {
  const {t} = useTranslation();
  const {formatDate} = useDateFormat();
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [contactFilter, setContactFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const [approveModalReq, setApproveModalReq] = useState<VisitRequest | null>(
    null,
  );
  const [rejectModalReq, setRejectModalReq] = useState<VisitRequest | null>(
    null,
  );

  const {requests, loading} = useRequests({
    status: statusFilter,
    searchQuery,
    contactName: contactFilter,
    preferredDate: dateFilter ? new Date(dateFilter) : undefined,
  });

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">
          {t("nav.requests" as any) as string}
        </h1>
        <Button onClick={() => window.open("/", "_blank")}>
          {t("admin.addRequest" as any) as string}
        </Button>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="p-4 border-b bg-gray-50 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-2">
            {["all", "pending", "approved", "rejected"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  statusFilter === status
                    ? "bg-white shadow border-gray-200 text-emerald-600"
                    : "text-gray-600 hover:bg-gray-100"
                }`}>
                <span>
                  {
                    t(
                      ("admin.filter" +
                        status.charAt(0).toUpperCase() +
                        status.slice(1)) as any,
                    ) as string
                  }
                </span>
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
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
            <div className="w-full sm:w-48">
              <Input
                placeholder={t("admin.searchContact" as any) as string}
                value={contactFilter}
                onChange={(e) => setContactFilter(e.target.value)}
                className="bg-white"
              />
            </div>
            <div className="w-full sm:w-40">
              <Input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="bg-white"
              />
            </div>
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
                  {t("admin.contact" as any) as string}
                </th>
                <th className="px-6 py-4 font-medium text-gray-500 text-start">
                  {t("form.numberOfStudents" as any) as string}
                </th>
                <th className="px-6 py-4 font-medium text-gray-500 text-start">
                  {t("admin.date" as any) as string}
                </th>
                <th className="px-6 py-4 font-medium text-gray-500 text-start">
                  {t("admin.status" as any) as string}
                </th>
                <th className="px-6 py-4 font-medium text-gray-500 text-end">
                  {t("admin.actions" as any) as string}
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
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold" dir="auto">
                          {r.contactPerson}
                        </span>
                        <a
                          href={buildWhatsAppLink(r.phone, "")}
                          target="_blank"
                          rel="noreferrer"
                          className="text-green-500 hover:text-green-600">
                          <MessageCircle size={16} />
                        </a>
                      </div>
                      <span className="text-xs text-gray-500" dir="auto">
                        {r.phone}
                      </span>
                      {r.email && (
                        <span className="text-xs text-gray-500">{r.email}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-start">{r.numberOfStudents}</td>
                  <td className="px-6 py-4 text-start">
                    {r.preferredDate
                      ? formatDate(r.preferredDate.toDate(), "PPP")
                      : "-"}
                  </td>
                  <td className="px-6 py-4 text-start">
                    <StatusBadge status={r.status} />
                  </td>
                  <td className="px-6 py-4 text-end space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setApproveModalReq(r)}>
                      {t("admin.view" as any) as string}
                    </Button>
                    {r.status === "pending" && (
                      <>
                        <Button size="sm" onClick={() => setApproveModalReq(r)}>
                          {t("admin.approve" as any) as string}
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => setRejectModalReq(r)}>
                          {t("admin.reject" as any) as string}
                        </Button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
              {requests.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-gray-500">
                    {t("admin.noRequests" as any) as string}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <ApproveModal
        isOpen={!!approveModalReq}
        onClose={() => setApproveModalReq(null)}
        request={approveModalReq}
      />
      <RejectModal
        isOpen={!!rejectModalReq}
        onClose={() => setRejectModalReq(null)}
        request={rejectModalReq}
      />
    </div>
  );
};
