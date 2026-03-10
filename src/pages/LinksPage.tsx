import { useState, useEffect } from "react";
import { motion, Reorder } from "framer-motion";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useLinks, useCreateLink, useUpdateLink, useDeleteLink, useReorderLinks } from "@/hooks/useApi";
import type { Link as LinkType } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Plus, GripVertical, ExternalLink, Pencil, Trash2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";

const LinksPage = () => {
  const { data: fetchedLinks, isLoading } = useLinks();
  const [links, setLinks] = useState<LinkType[]>([]);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", url: "" });

  const createLink = useCreateLink();
  const updateLink = useUpdateLink();
  const deleteLink = useDeleteLink();
  const reorderLinks = useReorderLinks();

  useEffect(() => {
    if (fetchedLinks) setLinks(fetchedLinks);
  }, [fetchedLinks]);

  const handleSave = () => {
    if (!form.title || !form.url) return toast.error("Fill in all fields");
    if (editId) {
      updateLink.mutate({ id: editId, data: form });
    } else {
      createLink.mutate(form);
    }
    setForm({ title: "", url: "" });
    setEditId(null);
    setOpen(false);
  };

  const handleDelete = (id: string) => {
    deleteLink.mutate(id);
  };

  const handleEdit = (link: LinkType) => {
    setForm({ title: link.title, url: link.url });
    setEditId(link._id);
    setOpen(true);
  };

  const handleToggle = (id: string, enabled: boolean) => {
    updateLink.mutate({ id, data: { enabled } });
  };

  const handleReorder = (newOrder: LinkType[]) => {
    setLinks(newOrder);
    reorderLinks.mutate(newOrder.map(l => l._id));
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-3xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">Links</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage your profile links</p>
          </div>
          <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) { setEditId(null); setForm({ title: "", url: "" }); } }}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1.5"><Plus className="w-4 h-4" /> Add Link</Button>
            </DialogTrigger>
            <DialogContent className="glass-strong border-border">
              <DialogHeader>
                <DialogTitle className="font-display">{editId ? "Edit Link" : "Add Link"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-2">
                <div>
                  <label className="text-sm text-foreground font-medium mb-1.5 block">Title</label>
                  <Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="My Portfolio" className="bg-secondary/50" />
                </div>
                <div>
                  <label className="text-sm text-foreground font-medium mb-1.5 block">URL</label>
                  <Input value={form.url} onChange={e => setForm({ ...form, url: e.target.value })} placeholder="https://example.com" className="bg-secondary/50" />
                </div>
                <Button onClick={handleSave} className="w-full" disabled={createLink.isPending || updateLink.isPending}>
                  {(createLink.isPending || updateLink.isPending) ? "Saving..." : editId ? "Update" : "Add"} Link
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {links.length === 0 ? (
          <div className="glass rounded-2xl p-12 text-center">
            <p className="text-muted-foreground">No links yet. Add your first link to get started!</p>
          </div>
        ) : (
          <Reorder.Group axis="y" values={links} onReorder={handleReorder} className="space-y-3">
            {links.map(link => (
              <Reorder.Item key={link._id} value={link} className="cursor-grab active:cursor-grabbing">
                <motion.div layout className="glass rounded-2xl p-4 flex items-center gap-3 hover-lift group">
                  <GripVertical className="w-4 h-4 text-muted-foreground shrink-0 opacity-50 group-hover:opacity-100 transition-opacity" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{link.title}</p>
                    <p className="text-xs text-muted-foreground truncate flex items-center gap-1"><ExternalLink className="w-3 h-3" />{link.url}</p>
                  </div>
                  <span className="text-xs text-muted-foreground shrink-0">{link.clicks} clicks</span>
                  <Switch checked={link.enabled} onCheckedChange={(v) => handleToggle(link._id, v)} />
                  <button onClick={() => handleEdit(link)} className="p-1.5 rounded-lg hover:bg-secondary/50 text-muted-foreground hover:text-foreground transition-colors">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(link._id)} className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </motion.div>
              </Reorder.Item>
            ))}
          </Reorder.Group>
        )}
      </motion.div>
    </DashboardLayout>
  );
};

export default LinksPage;
