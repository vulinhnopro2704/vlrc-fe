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

export interface InsertLinkDialogProps {
  open: boolean;
  defaultUrl?: string;
  onOpenChange: (open: boolean) => void;
  onConfirm: (url: string) => void;
}

export function InsertLinkDialog({
  open,
  defaultUrl = '',
  onOpenChange,
  onConfirm,
}: InsertLinkDialogProps): JSX.Element {
  const [url, setUrl] = useState(defaultUrl);

  useEffect(() => {
    if (open) {
      setUrl(defaultUrl || 'https://');
    }
  }, [open, defaultUrl]);

  const handleSubmit = useCallback(
    (e?: React.FormEvent) => {
      e?.preventDefault();
      const trimmed = url.trim();
      if (trimmed) {
        onConfirm(trimmed);
      }
      onOpenChange(false);
    },
    [url, onConfirm, onOpenChange],
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent asChild={false}>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Insert Link</DialogTitle>
            <DialogDescription>
              Enter a URL to turn your selection into a clickable link.
            </DialogDescription>
          </DialogHeader>

          <VStack gap="md" style={{ marginBlock: '1.25rem' }}>
            <VStack gap="xs">
              <Label htmlFor="link-url">URL</Label>
              <Input
                id="link-url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                autoFocus
              />
            </VStack>
          </VStack>

          <DialogFooter>
            <Button type="button" variant="outline" size="sm" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="default" size="sm">
              Save Link
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default InsertLinkDialog;
