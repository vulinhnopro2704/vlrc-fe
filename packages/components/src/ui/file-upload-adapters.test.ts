import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  formatFileSize,
  createApiUploadHandler,
  createUploadThingUploadHandler,
  createS3PresignedUploadHandler,
} from './file-upload-adapters';

interface MockXHRInstance {
  status: number;
  statusText: string;
  responseText: string;
  withCredentials: boolean;
  upload: { onprogress: ((event: ProgressEvent) => void) | null };
  open: ReturnType<typeof vi.fn>;
  setRequestHeader: ReturnType<typeof vi.fn>;
  onload: (() => void) | null;
  onerror: (() => void) | null;
  send: ReturnType<typeof vi.fn>;
}

describe('file-upload-adapters', () => {
  describe('formatFileSize', () => {
    it.each([
      [0, '0 B'],
      [500, '500 B'],
      [1024, '1 KB'],
      [1536, '1.5 KB'],
      [1048576, '1 MB'],
      [5242880, '5 MB'],
      [1073741824, '1 GB'],
    ])('should format %i bytes to %s', (bytes, expected) => {
      expect(formatFileSize(bytes)).toBe(expected);
    });
  });

  describe('createApiUploadHandler', () => {
    const mockFile = new File(['content'], 'test-image.png', { type: 'image/png' });
    let originalXHR: typeof global.XMLHttpRequest;

    beforeEach(() => {
      originalXHR = global.XMLHttpRequest;
    });

    afterEach(() => {
      global.XMLHttpRequest = originalXHR;
      vi.restoreAllMocks();
    });

    it('should upload file successfully via API endpoint and parse json response', async () => {
      let instance: MockXHRInstance | undefined;

      class MockXHR implements MockXHRInstance {
        status = 200;
        statusText = 'OK';
        responseText = JSON.stringify({
          url: 'https://storage.vlrc.vn/test-image.png',
          key: 'file-123',
        });
        withCredentials = false;
        upload: { onprogress: ((event: ProgressEvent) => void) | null } = { onprogress: null };
        open = vi.fn();
        setRequestHeader = vi.fn();
        onload: (() => void) | null = null;
        onerror: (() => void) | null = null;
        send = vi.fn().mockImplementation(() => {
          if (this.onload) this.onload();
        });
        constructor() {
          instance = this;
        }
      }

      global.XMLHttpRequest = MockXHR as unknown as typeof XMLHttpRequest;

      const onProgress = vi.fn();
      const onSuccess = vi.fn();

      const handler = createApiUploadHandler({
        endpoint: '/api/v1/upload',
        method: 'POST',
      });

      const results = await handler([mockFile], { onProgress, onSuccess });

      expect(instance?.open).toHaveBeenCalledWith('POST', '/api/v1/upload', true);
      expect(results).toHaveLength(1);
      expect(results[0]?.url).toBe('https://storage.vlrc.vn/test-image.png');
      expect(results[0]?.key).toBe('file-123');
      expect(onSuccess).toHaveBeenCalledWith(mockFile, results[0]);
    });

    it('should handle custom responseParser returning a string URL', async () => {
      class MockXHR implements MockXHRInstance {
        status = 201;
        statusText = 'Created';
        responseText = JSON.stringify({
          payload: { downloadUrl: 'https://storage.vlrc.vn/custom-url.png' },
        });
        withCredentials = false;
        upload: { onprogress: ((event: ProgressEvent) => void) | null } = { onprogress: null };
        open = vi.fn();
        setRequestHeader = vi.fn();
        onload: (() => void) | null = null;
        onerror: (() => void) | null = null;
        send = vi.fn().mockImplementation(() => {
          if (this.onload) this.onload();
        });
      }

      global.XMLHttpRequest = MockXHR as unknown as typeof XMLHttpRequest;

      interface CustomPayloadResponse {
        payload: { downloadUrl: string };
      }

      const handler = createApiUploadHandler({
        endpoint: '/api/upload',
        responseParser: (res: unknown) => (res as CustomPayloadResponse).payload.downloadUrl,
      });

      const results = await handler([mockFile]);
      expect(results[0]?.url).toBe('https://storage.vlrc.vn/custom-url.png');
    });

    it('should reject when server returns 500 status', async () => {
      class MockXHR implements MockXHRInstance {
        status = 500;
        statusText = 'Internal Server Error';
        responseText = 'Server Error';
        withCredentials = false;
        upload: { onprogress: ((event: ProgressEvent) => void) | null } = { onprogress: null };
        open = vi.fn();
        setRequestHeader = vi.fn();
        onload: (() => void) | null = null;
        onerror: (() => void) | null = null;
        send = vi.fn().mockImplementation(() => {
          if (this.onload) this.onload();
        });
      }

      global.XMLHttpRequest = MockXHR as unknown as typeof XMLHttpRequest;

      const onError = vi.fn();
      const handler = createApiUploadHandler({ endpoint: '/api/upload' });

      await expect(handler([mockFile], { onError })).rejects.toThrow(
        'Upload failed with status 500',
      );
      expect(onError).toHaveBeenCalled();
    });
  });

  describe('createUploadThingUploadHandler', () => {
    const mockFile = new File(['content'], 'avatar.jpg', { type: 'image/jpeg' });

    it('should upload files using provided uploadFiles helper', async () => {
      const mockUploadFiles = vi.fn().mockResolvedValue([
        {
          key: 'ut-key-1',
          name: 'avatar.jpg',
          size: 1024,
          type: 'image/jpeg',
          ufsUrl: 'https://utfs.io/f/ut-key-1',
        },
      ]);

      const onProgress = vi.fn();
      const handler = createUploadThingUploadHandler({
        uploadFiles: mockUploadFiles,
        endpoint: 'imageUploader',
      });

      const results = await handler([mockFile], { onProgress });

      expect(mockUploadFiles).toHaveBeenCalledWith(
        'imageUploader',
        expect.objectContaining({
          files: [mockFile],
        }),
      );
      expect(results).toHaveLength(1);
      expect(results[0]?.url).toBe('https://utfs.io/f/ut-key-1');
      expect(results[0]?.key).toBe('ut-key-1');
    });

    it('should report error when uploadFiles throws', async () => {
      const mockUploadFiles = vi.fn().mockRejectedValue(new Error('UploadThing quota exceeded'));
      const onError = vi.fn();

      const handler = createUploadThingUploadHandler({
        uploadFiles: mockUploadFiles,
        endpoint: 'imageUploader',
      });

      await expect(handler([mockFile], { onError })).rejects.toThrow('UploadThing quota exceeded');
      expect(onError).toHaveBeenCalled();
    });
  });

  describe('createS3PresignedUploadHandler', () => {
    const mockFile = new File(['s3-data'], 'doc.pdf', { type: 'application/pdf' });
    let originalXHR: typeof global.XMLHttpRequest;

    beforeEach(() => {
      originalXHR = global.XMLHttpRequest;
    });

    afterEach(() => {
      global.XMLHttpRequest = originalXHR;
    });

    it('should request presigned url and PUT file binary to S3', async () => {
      let instance: MockXHRInstance | undefined;

      class MockXHR implements MockXHRInstance {
        status = 200;
        statusText = 'OK';
        responseText = '';
        withCredentials = false;
        upload: { onprogress: ((event: ProgressEvent) => void) | null } = { onprogress: null };
        open = vi.fn();
        setRequestHeader = vi.fn();
        onload: (() => void) | null = null;
        onerror: (() => void) | null = null;
        send = vi.fn().mockImplementation(() => {
          if (this.onload) this.onload();
        });
        constructor() {
          instance = this;
        }
      }

      global.XMLHttpRequest = MockXHR as unknown as typeof XMLHttpRequest;

      const getPresignedUrl = vi.fn().mockResolvedValue({
        uploadUrl: 'https://s3.amazonaws.com/my-bucket/doc.pdf?signature=123',
        fileUrl: 'https://s3.amazonaws.com/my-bucket/doc.pdf',
      });

      const handler = createS3PresignedUploadHandler({ getPresignedUrl });
      const results = await handler([mockFile]);

      expect(getPresignedUrl).toHaveBeenCalledWith(mockFile);
      expect(instance?.open).toHaveBeenCalledWith(
        'PUT',
        'https://s3.amazonaws.com/my-bucket/doc.pdf?signature=123',
        true,
      );
      expect(results[0]?.url).toBe('https://s3.amazonaws.com/my-bucket/doc.pdf');
    });
  });
});
