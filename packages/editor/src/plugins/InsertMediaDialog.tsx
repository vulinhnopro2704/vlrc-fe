import { useState, useCallback, useEffect, type JSX } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Button,
  Input,
  Label,
  VStack,
} from '@vlrc-fe/components';

export type MediaType = 'image' | 'youtube' | 'figma';

export interface InsertMediaDialogProps {
  open: boolean;
  type: MediaType | null;
  onOpenChange: (open: boolean) => void;
  onConfirm: (data: { type: MediaType; url: string; caption?: string }) => void;
}

const MEDIA_CONFIG: Record<
  MediaType,
  {
    title: string;
    description: string;
    label: string;
    placeholder: string;
    defaultValue: string;
  }
> = {
  image: {
    title: 'Insert Image',
    description: 'Provide an image URL (PNG, JPG, SVG, WebP) to display in the document.',
    label: 'Image URL',
    placeholder: 'https://images.unsplash.com/...',
    defaultValue:
      'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80',
  },
  youtube: {
    title: 'Embed YouTube Video',
    description: 'Enter a YouTube Video ID or URL to embed an interactive player.',
    label: 'Video ID or URL',
    placeholder: 'jNQXAC9IVRw or https://youtube.com/watch?v=...',
    defaultValue: 'jNQXAC9IVRw',
  },
  figma: {
    title: 'Embed Figma Design',
    description: 'Enter a public Figma document or prototype link for live embedding.',
    label: 'Figma URL',
    placeholder: 'https://www.figma.com/file/...',
    defaultValue: 'https://www.figma.com/file/LKQ4FJ4bTnCSjedbRpk931/Sample-File',
  },
};

export function InsertMediaDialog({
  open,
  type,
  onOpenChange,
  onConfirm,
}: InsertMediaDialogProps): JSX.Element | null {
  const [url, setUrl] = useState('');
  const [caption, setCaption] = useState('');

  const config = type ? MEDIA_CONFIG[type] : null;

  useEffect(() => {
    if (open && config) {
      setUrl(config.defaultValue);
      setCaption('');
    }
  }, [open, config]);

  const handleSubmit = useCallback(
    (e?: React.FormEvent) => {
      e?.preventDefault();
      if (!type) return;
      const trimmed = url.trim();
      if (trimmed) {
        onConfirm({
          type,
          url: trimmed,
          caption: caption.trim() || undefined,
        });
      }
      onOpenChange(false);
    },
    [type, url, caption, onConfirm, onOpenChange],
  );

  if (!type || !config) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent asChild={false}>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{config.title}</DialogTitle>
            <DialogDescription>{config.description}</DialogDescription>
          </DialogHeader>

          <VStack gap="md" style={{ marginBlock: '1.25rem' }}>
            <VStack gap="xs">
              <Label htmlFor="media-url">{config.label}</Label>
              <Input
                id="media-url"
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder={config.placeholder}
                autoFocus
              />
            </VStack>

            {type === 'image' && (
              <VStack gap="xs">
                <Label htmlFor="media-caption">Caption (Optional)</Label>
                <Input
                  id="media-caption"
                  type="text"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Image caption..."
                />
              </VStack>
            )}
          </VStack>

          <DialogFooter>
            <Button type="button" variant="outline" size="sm" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="default" size="sm">
              Insert
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
