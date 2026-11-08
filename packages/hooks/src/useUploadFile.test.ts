import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useUploadFile } from './useUploadFile';

describe('useUploadFile Hook', () => {
  it('should initialize with idle state and empty files', () => {
    const { result } = renderHook(() => useUploadFile());

    expect(result.current.isUploading).toBe(false);
    expect(result.current.uploadedFiles).toEqual([]);
    expect(result.current.progresses).toEqual({});
    expect(result.current.error).toBeNull();
  });

  it('should manage upload progress and update state on success', async () => {
    const mockFile = new File(['data'], 'photo.jpg', { type: 'image/jpeg' });
    const mockHandler = vi.fn().mockImplementation(async (files, options) => {
      options?.onProgress?.(files[0], 50);
      options?.onProgress?.(files[0], 100);
      return [
        {
          key: 'key-1',
          name: 'photo.jpg',
          size: 100,
          type: 'image/jpeg',
          url: 'https://cdn.example.com/photo.jpg',
        },
      ];
    });

    const { result } = renderHook(() => useUploadFile({ uploadHandler: mockHandler }));

    let uploadPromise: Promise<any>;
    act(() => {
      uploadPromise = result.current.onUpload([mockFile]);
    });

    await act(async () => {
      await uploadPromise;
    });

    expect(result.current.isUploading).toBe(false);
    expect(result.current.uploadedFiles).toHaveLength(1);
    expect(result.current.uploadedFiles[0]?.url).toBe('https://cdn.example.com/photo.jpg');
  });

  it('should capture and expose upload error', async () => {
    const mockFile = new File(['data'], 'error.png', { type: 'image/png' });
    const mockHandler = vi.fn().mockRejectedValue(new Error('Network failure'));

    const onError = vi.fn();
    const { result } = renderHook(() => useUploadFile({ uploadHandler: mockHandler, onError }));

    await act(async () => {
      try {
        await result.current.onUpload([mockFile]);
      } catch {
        // Expected
      }
    });

    expect(result.current.isUploading).toBe(false);
    expect(result.current.error?.message).toBe('Network failure');
    expect(onError).toHaveBeenCalled();
  });

  it('should reset uploaded files and state when reset is called', () => {
    const { result } = renderHook(() =>
      useUploadFile({
        defaultUploadedFiles: [
          {
            key: 'initial',
            name: 'initial.png',
            size: 50,
            type: 'image/png',
            url: 'https://cdn.example.com/initial.png',
          },
        ],
      }),
    );

    expect(result.current.uploadedFiles).toHaveLength(1);

    act(() => {
      result.current.reset();
    });

    expect(result.current.uploadedFiles).toEqual([]);
    expect(result.current.progresses).toEqual({});
  });
});
