import { useState, useCallback, type JSX } from 'react';
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
  Checkbox,
  VStack,
  HStack,
  Text,
} from '@vlrc-fe/components';

export interface InsertTableDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (options: { rows: string; columns: string; includeHeaders: boolean }) => void;
}

export function InsertTableDialog({
  open,
  onOpenChange,
  onConfirm,
}: InsertTableDialogProps): JSX.Element {
  const [rows, setRows] = useState('4');
  const [columns, setColumns] = useState('4');
  const [includeHeaders, setIncludeHeaders] = useState(true);

  const handleSubmit = useCallback(
    (e?: React.FormEvent) => {
      e?.preventDefault();
      const rowNum = Math.max(1, Math.min(50, parseInt(rows, 10) || 4));
      const colNum = Math.max(1, Math.min(20, parseInt(columns, 10) || 4));
      onConfirm({
        rows: String(rowNum),
        columns: String(colNum),
        includeHeaders,
      });
      onOpenChange(false);
    },
    [rows, columns, includeHeaders, onConfirm, onOpenChange],
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent asChild={false}>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Insert Table</DialogTitle>
            <DialogDescription>
              Specify the dimensions and header configuration for your new table.
            </DialogDescription>
          </DialogHeader>

          <VStack gap="md" style={{ marginBlock: '1.25rem' }}>
            <VStack gap="xs">
              <Label htmlFor="table-rows">
                <Text size="sm" weight="medium">
                  Rows
                </Text>
              </Label>
              <Input
                id="table-rows"
                type="number"
                min={1}
                max={50}
                value={rows}
                onChange={(e) => setRows(e.target.value)}
                placeholder="# of rows (1-50)"
                autoFocus
              />
            </VStack>

            <VStack gap="xs">
              <Label htmlFor="table-columns">
                <Text size="sm" weight="medium">
                  Columns
                </Text>
              </Label>
              <Input
                id="table-columns"
                type="number"
                min={1}
                max={20}
                value={columns}
                onChange={(e) => setColumns(e.target.value)}
                placeholder="# of columns (1-20)"
              />
            </VStack>

            <HStack gap="sm" align="center">
              <Checkbox
                id="table-headers"
                checked={includeHeaders}
                onCheckedChange={(checked) => setIncludeHeaders(checked === true)}
              />
              <Label htmlFor="table-headers" style={{ cursor: 'pointer' }}>
                <Text size="sm">Include Header Row</Text>
              </Label>
            </HStack>
          </VStack>

          <DialogFooter>
            <Button type="button" variant="outline" size="sm" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="default" size="sm">
              Insert Table
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
