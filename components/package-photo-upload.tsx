"use client";

import { CldUploadWidget } from "next-cloudinary";
import { Camera, X, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { Button } from "./ui/button";

interface PackagePhotoUploadProps {
  value: string;
  onChange: (value: string) => void;
  onRemove: () => void;
}

export default function PackagePhotoUpload({
  value,
  onChange,
  onRemove
}: PackagePhotoUploadProps) {
  
  const onUpload = (result: any) => {
    onChange(result.info.secure_url);
  };

  return (
    <div className="space-y-4 w-full flex flex-col items-center justify-center">
      <div className="flex items-center gap-4">
        {value ? (
          <div className="relative w-[160px] h-[160px] rounded-2xl overflow-hidden border-4 border-teal-500/20 shadow-xl">
            <div className="absolute top-2 right-2 z-10">
              <Button 
                type="button" 
                onClick={onRemove} 
                variant="destructive" 
                size="icon"
                className="h-8 w-8 rounded-full shadow-lg"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <Image
              fill
              className="object-cover"
              alt="Package Image"
              src={value}
            />
          </div>
        ) : (
          <CldUploadWidget 
            onSuccess={onUpload} 
            uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "crowdcarry_unsigned"}
          >
            {({ open }) => {
              const onClick = () => {
                open();
              };

              return (
                <button
                  type="button"
                  onClick={onClick}
                  className="w-full min-h-[160px] border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl flex flex-col items-center justify-center gap-3 hover:border-teal-500 hover:bg-teal-50/50 dark:hover:bg-teal-900/10 transition-all group"
                >
                  <div className="h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center group-hover:bg-teal-100 dark:group-hover:bg-teal-900/30 transition-colors">
                    <Camera className="h-6 w-6 text-gray-500 group-hover:text-teal-600" />
                  </div>
                  <div className="text-center px-4">
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Click to upload package photo</p>
                    <p className="text-xs text-gray-500">PNG, JPG or WebP (Max 5MB)</p>
                  </div>
                </button>
              );
            }}
          </CldUploadWidget>
        )}
      </div>
      
      {!value && (
        <div className="flex items-center gap-2 text-xs text-orange-600 font-medium bg-orange-50 dark:bg-orange-900/10 px-3 py-1.5 rounded-full border border-orange-100 dark:border-orange-800/30">
          <ImageIcon className="h-3 w-3" />
          Adding a photo helps travelers trust your package move!
        </div>
      )}
    </div>
  );
}
