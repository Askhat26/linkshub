import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useQrStats, useDownloadQr } from "@/hooks/useApi";
import { Download, Copy, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const QRPage = () => {
  const { user } = useAuth();
  const { data: stats } = useQrStats();
  const downloadQr = useDownloadQr();
  const profileUrl = `https://linkora.io/${user?.username || ""}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(profileUrl);
    toast.success("Link copied!");
  };

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl space-y-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">QR Code</h1>
          <p className="text-sm text-muted-foreground mt-1">Share your profile with a scannable QR code</p>
        </div>

        <div className="glass rounded-2xl p-8 flex flex-col items-center">
          <div className="w-64 h-64 rounded-2xl bg-white flex items-center justify-center mb-6 relative overflow-hidden">
            <div className="absolute inset-4 grid grid-cols-8 grid-rows-8 gap-1">
              {Array.from({ length: 64 }).map((_, i) => (
                <div key={i} className={`rounded-sm ${Math.random() > 0.4 ? "bg-gray-900" : "bg-white"}`} />
              ))}
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center z-10">
                <QrCode className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <p className="text-sm text-muted-foreground mb-4">{profileUrl}</p>

          <div className="flex gap-3">
            <Button variant="outline" size="sm" className="gap-1.5" onClick={handleCopy}>
              <Copy className="w-4 h-4" /> Copy Link
            </Button>
            <Button size="sm" className="gap-1.5" onClick={() => downloadQr.mutate()} disabled={downloadQr.isPending}>
              <Download className="w-4 h-4" /> {downloadQr.isPending ? "Downloading..." : "Download PNG"}
            </Button>
          </div>
        </div>

        <div className="glass rounded-2xl p-5">
          <h3 className="text-sm font-medium text-foreground mb-2">QR Scan Stats</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-xl font-display font-bold text-foreground">{stats?.total ?? "—"}</p>
              <p className="text-xs text-muted-foreground">Total Scans</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-display font-bold text-foreground">{stats?.thisWeek ?? "—"}</p>
              <p className="text-xs text-muted-foreground">This Week</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-display font-bold text-foreground">{stats?.today ?? "—"}</p>
              <p className="text-xs text-muted-foreground">Today</p>
            </div>
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default QRPage;
