import React, { useState, useCallback, ChangeEvent, DragEvent } from 'react';
import { Upload, X, File } from 'lucide-react';

interface FileWithPreview extends File {
  preview?: string;
}

interface FileUploaderProps {
  maxFiles?: number;
  maxSizeInMB?: number;
  acceptedFileTypes?: string[];
  onFilesChange?: (files: File[]) => void;
}

const DEFAULT_MAX_SIZE_IN_MB = 5;
const DEFAULT_MAX_FILES = 10;

const FileUploader: React.FC<FileUploaderProps> = ({
  maxFiles = DEFAULT_MAX_FILES,
  maxSizeInMB = DEFAULT_MAX_SIZE_IN_MB,
  acceptedFileTypes,
  onFilesChange,
}) => {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File): boolean => {
    // Check file size
    if (file.size > maxSizeInMB * 1024 * 1024) {
      setError(`File size must be less than ${maxSizeInMB}MB`);
      return false;
    }

    // Check file type if acceptedFileTypes is provided
    if (acceptedFileTypes && acceptedFileTypes.length > 0) {
      if (!acceptedFileTypes.includes(file.type)) {
        setError('File type not supported');
        return false;
      }
    }

    return true;
  };

  const handleFiles = (newFiles: FileList | File[]): void => {
    setError(null);

    // Convert FileList to Array
    const filesArray = Array.from(newFiles);

    // Check max files limit
    if (files.length + filesArray.length > maxFiles) {
      setError(`Maximum ${maxFiles} files allowed`);
      return;
    }

    // Validate each file
    const validFiles = filesArray.filter(validateFile);

    if (validFiles.length === 0) return;

    const filesWithPreviews = validFiles.map((file) => {
      const fileWithPreview = file as FileWithPreview;
      if (file.type.startsWith('image/')) {
        fileWithPreview.preview = URL.createObjectURL(file);
      }
      return fileWithPreview;
    });

    setFiles((prevFiles) => {
      const updatedFiles = [...prevFiles, ...filesWithPreviews];
      if (onFilesChange) {
        onFilesChange(updatedFiles);
      }
      return updatedFiles;
    });
  };

  const handleDragEnter = useCallback((e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  }, []);

  const handleFileInput = useCallback((e: ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  }, []);

  const removeFile = useCallback((indexToRemove: number): void => {
    setFiles((prevFiles) => {
      const fileToRemove = prevFiles[indexToRemove];
      if (fileToRemove.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      const updatedFiles = prevFiles.filter((_, index) => index !== indexToRemove);
      if (onFilesChange) {
        onFilesChange(updatedFiles);
      }
      return updatedFiles;
    });
  }, [onFilesChange]);

  // Cleanup previews when component unmounts
  React.useEffect(() => {
    return () => {
      files.forEach((file) => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
  }, []);

  const formatFileSize = (sizeInBytes: number): string => {
    if (sizeInBytes < 1024) {
      return `${sizeInBytes} B`;
    } else if (sizeInBytes < 1024 * 1024) {
      return `${(sizeInBytes / 1024).toFixed(1)} KB`;
    }
    return `${(sizeInBytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center ${
          isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        }`}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          multiple
          onChange={handleFileInput}
          className="hidden"
          id="fileInput"
          accept={acceptedFileTypes?.join(',')}
        />
        
        <div className="flex flex-col items-center justify-center space-y-4">
          <Upload className="w-12 h-12 text-gray-400" />
          <label
            htmlFor="fileInput"
            className="cursor-pointer text-blue-500 hover:text-blue-600"
          >
            Choose files
          </label>
          <p className="text-gray-500">or drag and drop files here</p>
          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}
        </div>
      </div>

      {files.length > 0 && (
        <div className="mt-6 space-y-4">
          <h3 className="text-lg font-semibold">
            Uploaded Files ({files.length}/{maxFiles})
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {files.map((file, index) => (
              <div
                key={index}
                className="relative border rounded-lg p-4 flex items-start space-x-3"
              >
                <div className="flex-shrink-0">
                  {file.preview ? (
                    <img
                      src={file.preview}
                      alt={file.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  ) : (
                    <File className="w-16 h-16 text-gray-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {file.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatFileSize(file.size)}
                  </p>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                  type="button"
                  aria-label="Remove file"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploader;