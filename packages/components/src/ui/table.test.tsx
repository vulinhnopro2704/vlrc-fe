import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from './table';

const CAPTION_TEXT = 'A list of recent invoices.';
const HEADER_INVOICE = 'Invoice';
const HEADER_STATUS = 'Status';
const HEADER_AMOUNT = 'Amount';

describe('Table', () => {
  describe('UI', () => {
    it('should match snapshot in full table composition', () => {
      const { asFragment } = render(
        <Table>
          <TableCaption>{CAPTION_TEXT}</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>{HEADER_INVOICE}</TableHead>
              <TableHead>{HEADER_STATUS}</TableHead>
              <TableHead>{HEADER_AMOUNT}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>INV001</TableCell>
              <TableCell>Paid</TableCell>
              <TableCell>$250.00</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>INV002</TableCell>
              <TableCell>Pending</TableCell>
              <TableCell>$150.00</TableCell>
            </TableRow>
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={2}>Total</TableCell>
              <TableCell>$400.00</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      );
      expect(asFragment()).toMatchSnapshot();
    });
  });
});
