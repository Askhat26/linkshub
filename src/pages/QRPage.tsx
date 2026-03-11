import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useQrStats, useDownloadQr } from "@/hooks/useApi";
import { Download, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { QRCodeCanvas } from "qrcode.react";
import { useRef } from "react";

const QRPage = () => {
  const { user } = useAuth();
  const { data: stats } = useQrStats();
  const downloadQr = useDownloadQr();
  const qrRef = useRef<HTMLCanvasElement>(null);

  const profileUrl = `https://linkshub-lake.vercel.app/${user?.username || ""}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(profileUrl);
    toast.success("Link copied!");
  };

  const handleDownload = () => {
    const canvas = qrRef.current;
    if (!canvas) return;

    const pngUrl = canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");

    const downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = `${user?.username}-qr.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl space-y-6"
      >
        {/* Header */}
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">
            QR Code
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Share your profile with a scannable QR code
          </p>
        </div>

        {/* QR Card */}
        <div className="glass rounded-2xl p-8 flex flex-col items-center">

          {/* Gradient background like your image */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-indigo-500 shadow-xl">

            <div className="bg-white p-4 rounded-xl relative">

              {/* Real QR Code */}
              <QRCodeCanvas
                value={profileUrl}
                size={200}
                bgColor="#ffffff"
                fgColor="#000000"
                level="H"
                includeMargin={false}
                ref={qrRef}
              />

              {/* Center Logo */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                  L
                </div>
              </div>
            </div>
          </div>

          {/* Profile URL */}
          <p className="text-sm text-muted-foreground mt-6 mb-4 text-center break-all">
            {profileUrl}
          </p>

          {/* Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={handleCopy}
            >
              <Copy className="w-4 h-4" />
              Copy Link
            </Button>

            <Button
              size="sm"
              className="gap-1.5"
              onClick={handleDownload}
            >
              <Download className="w-4 h-4" />
              Download PNG
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="glass rounded-2xl p-5">
          <h3 className="text-sm font-medium text-foreground mb-2">
            QR Scan Stats
          </h3>

          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-xl font-display font-bold text-foreground">
                {stats?.total ?? "—"}
              </p>
              <p className="text-xs text-muted-foreground">
                Total Scans
              </p>
            </div>

            <div className="text-center">
              <p className="text-xl font-display font-bold text-foreground">
                {stats?.thisWeek ?? "—"}
              </p>
              <p className="text-xs text-muted-foreground">
                This Week
              </p>
            </div>

            <div className="text-center">
              <p className="text-xl font-display font-bold text-foreground">
                {stats?.today ?? "—"}
              </p>
              <p className="text-xs text-muted-foreground">
                Today
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default QRPage;