import { useCallback, useState } from "react";
import Cropper from "react-easy-crop";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { getCroppedImageBlob } from "@/lib/cropImage";

type Area = { width: number; height: number; x: number; y: number };

export default function AvatarCropperDialog({
  open,
  imageSrc,
  onClose,
  onCropped,
}: {
  open: boolean;
  imageSrc: string;
  onClose: () => void;
  onCropped: (file: File) => Promise<void> | void;
}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1.2);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [saving, setSaving] = useState(false);

  const onCropComplete = useCallback((_area: any, areaPixels: Area) => {
    setCroppedAreaPixels(areaPixels);
  }, []);

  const handleSave = async () => {
    if (!croppedAreaPixels || !imageSrc) return;
    setSaving(true);
    try {
      const blob = await getCroppedImageBlob(imageSrc, croppedAreaPixels, 512);
      const file = new File([blob], "avatar.jpg", { type: "image/jpeg" });
      await onCropped(file);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => (!v ? onClose() : null)}>
      <DialogContent className="glass-strong border-border max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display">Crop your avatar</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative w-full h-[340px] rounded-2xl overflow-hidden border border-border bg-secondary/30">
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
              cropShape="round"
              showGrid={false}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>

          <div className="space-y-2">
            <div className="text-xs text-muted-foreground">Zoom</div>
            <input
              type="range"
              min={1}
              max={3}
              step={0.02}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="flex gap-2">
            <Button variant="outline" className="w-full" onClick={onClose} disabled={saving}>
              Cancel
            </Button>
            <Button className="w-full" onClick={handleSave} disabled={saving || !croppedAreaPixels}>
              {saving ? "Saving..." : "Use photo"}
            </Button>
          </div>

          <p className="text-[11px] text-muted-foreground">
            Drag to reposition. Zoom to fit your face/logo.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}