import React, { useRef } from 'react';
import { Upload, X } from 'lucide-react';
import Image from 'next/image';

interface PhotoUploaderProps {
  photo: string | null;
  onPhotoUpload: (photo: string | null) => void;
}

const PhotoUploader: React.FC<PhotoUploaderProps> = ({ photo, onPhotoUpload }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        onPhotoUpload(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-end">
        <label className="block text-sm font-semibold text-text-mid uppercase tracking-wider">
          3. Upload Edible Photo (Optional)
        </label>
        {photo && (
          <button
            onClick={() => onPhotoUpload(null)}
            className="text-xs text-rose-deep font-medium flex items-center gap-1 hover:underline"
          >
            <X size={14} /> Remove
          </button>
        )}
      </div>

      {!photo ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-cream-dark rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-cream/50 transition-colors group"
        >
          <div className="w-12 h-12 rounded-full bg-cream-dark flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Upload size={24} className="text-text-soft" />
          </div>
          <span className="text-sm font-medium text-text-mid">Click to upload photo</span>
          <span className="text-xs text-text-soft mt-1">PNG, JPG up to 5MB</span>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
        </div>
      ) : (
        <div className="relative w-full aspect-video rounded-xl overflow-hidden border-2 border-cream-dark bg-white">
          <Image
            src={photo}
            alt="Uploaded edible photo"
            fill
            className="object-contain"
          />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-32 h-32 border-2 border-white border-dashed rounded-full shadow-[0_0_0_9999px_rgba(0,0,0,0.3)]"></div>
          </div>
          <div className="absolute bottom-2 right-2 bg-black/50 text-white text-[10px] px-2 py-1 rounded-md backdrop-blur-sm">
            Circular Crop Preview
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoUploader;
