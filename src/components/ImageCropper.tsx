"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Cropper from "react-easy-crop";
import { X, Check, RotateCcw, Maximize2 } from "lucide-react";
import { useNotification } from "@/lib/useNotification";

interface ImageCropperProps {
  isOpen: boolean;
  onClose: () => void;
  onCropComplete: (croppedImageUrl: string) => void;
  folder?: string;
  aspectRatio?: number | null; // e.g., 16/9, 1/1, 4/3, or null for free
  initialImage?: string; // NOT USED - always start fresh
}

const ASPECT_RATIOS = [
  { label: "Free", value: null },
  { label: "Square (1:1)", value: 1 },
  { label: "Portrait (3:4)", value: 3 / 4 },
  { label: "Landscape (16:9)", value: 16 / 9 },
  { label: "Facebook (4:5)", value: 4 / 5 },
  { label: "Instagram (1.91:1)", value: 1.91 },
];

export function ImageCropper({
  isOpen,
  onClose,
  onCropComplete,
  folder = "project-images",
  aspectRatio = null,
}: ImageCropperProps) {
  const notification = useNotification();
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [currentAspectRatio, setCurrentAspectRatio] = useState<number | null>(
    aspectRatio,
  );
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);
  const [croppedPreview, setCroppedPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      notification.error("Please select a valid image file");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      notification.error("File size must be less than 10MB");
      return;
    }

    const reader = new FileReader();
    reader.addEventListener("load", () => {
      setImageSrc(reader.result as string);
    });
    reader.readAsDataURL(file);
  };

  const handleCropAreaChange = useCallback(
    async (croppedArea: any, croppedAreaPixels: any) => {
      setCroppedAreaPixels(croppedAreaPixels);
      // Generate preview
      if (imageSrc) {
        try {
          const image = await createImage(imageSrc);
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          if (ctx) {
            canvas.width = croppedAreaPixels.width;
            canvas.height = croppedAreaPixels.height;

            if (rotation !== 0) {
              const centerX = croppedAreaPixels.width / 2;
              const centerY = croppedAreaPixels.height / 2;
              ctx.translate(centerX, centerY);
              ctx.rotate((rotation * Math.PI) / 180);
              ctx.translate(-centerX, -centerY);
            }

            ctx.drawImage(
              image,
              croppedAreaPixels.x,
              croppedAreaPixels.y,
              croppedAreaPixels.width,
              croppedAreaPixels.height,
              0,
              0,
              croppedAreaPixels.width,
              croppedAreaPixels.height,
            );

            canvas.toBlob((blob) => {
              if (blob) {
                const url = URL.createObjectURL(blob);
                setCroppedPreview(url);
              }
            }, "image/jpeg");
          }
        } catch (error) {
          console.error("Preview error:", error);
        }
      }
    },
    [imageSrc, rotation],
  );

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener("load", () => resolve(image));
      image.addEventListener("error", (err) => reject(err));
      image.setAttribute("crossOrigin", "anonymous");
      image.src = url;
    });

  const getCroppedImg = async (
    imageSrc: string,
  ): Promise<{ url: string; blob: Blob }> => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx || !croppedAreaPixels) {
      throw new Error("Failed to get canvas context");
    }

    canvas.width = croppedAreaPixels.width;
    canvas.height = croppedAreaPixels.height;

    // Apply rotation
    if (rotation !== 0) {
      const centerX = croppedAreaPixels.width / 2;
      const centerY = croppedAreaPixels.height / 2;
      ctx.translate(centerX, centerY);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.translate(-centerX, -centerY);
    }

    ctx.drawImage(
      image,
      croppedAreaPixels.x,
      croppedAreaPixels.y,
      croppedAreaPixels.width,
      croppedAreaPixels.height,
      0,
      0,
      croppedAreaPixels.width,
      croppedAreaPixels.height,
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          resolve({ url, blob });
        }
      }, "image/jpeg");
    });
  };

  const handleApplyCrop = async () => {
    if (!imageSrc || !croppedAreaPixels) {
      notification.error("Please select and crop an image");
      return;
    }

    setIsUploading(true);

    try {
      const { blob } = await getCroppedImg(imageSrc);

      const formData = new FormData();
      formData.append("file", blob, "cropped-image.jpg");
      formData.append("folder", folder);

      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) {
        const error = await uploadResponse.json();
        throw new Error(error.error || "Upload failed");
      }

      const data = await uploadResponse.json();
      notification.success("Image cropped and uploaded successfully!");
      onCropComplete(data.url);

      // Revalidate paths to update user pages
      try {
        await fetch("/api/revalidate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            paths: [
              "/",
              "/about",
              "/projects",
              "/certificates",
              "/skills",
              "/contact",
            ],
          }),
        });
      } catch (error) {
        console.log("Revalidation request sent");
      }

      handleClose();
    } catch (error) {
      console.error("Crop error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to crop image";
      notification.error(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    setImageSrc(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
    setCroppedAreaPixels(null);
    setCroppedPreview(null);
    setCurrentAspectRatio(aspectRatio);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onClose();
  };

  // Reset to fresh state when modal opens
  useEffect(() => {
    if (isOpen) {
      setImageSrc(null);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setRotation(0);
      setCroppedAreaPixels(null);
      setCroppedPreview(null);
      setCurrentAspectRatio(aspectRatio);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }, [isOpen, aspectRatio]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white dark:bg-[#16191f] rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-white/5 bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-slate-900 dark:to-slate-800/50">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Crop Image
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Just like your phone camera
            </p>
          </div>
          <button
            onClick={handleClose}
            disabled={isUploading}
            className="p-2 hover:bg-white dark:hover:bg-white/10 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {!imageSrc ? (
            <div className="space-y-4 h-full flex flex-col items-center justify-center">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <Maximize2 size={48} className="text-indigo-300" />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center justify-center gap-2 px-6 py-12 rounded-2xl border-2 border-dashed border-indigo-300 dark:border-indigo-500/30 bg-indigo-50 dark:bg-indigo-500/5 hover:border-indigo-400 dark:hover:border-indigo-500/50 transition-colors"
              >
                <span className="text-center">
                  <div className="text-indigo-700 dark:text-indigo-400 font-bold text-lg">
                    Select Image to Crop
                  </div>
                  <div className="text-sm text-indigo-600/70 dark:text-indigo-500/70 mt-2">
                    Tap to choose image from your device
                  </div>
                </span>
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Cropper Preview */}
                <div className="lg:col-span-2 space-y-4">
                  <div
                    className="relative w-full bg-slate-900 rounded-2xl overflow-hidden shadow-2xl"
                    style={{
                      aspectRatio: currentAspectRatio
                        ? `${currentAspectRatio}`
                        : "16/9",
                    }}
                  >
                    <Cropper
                      image={imageSrc}
                      crop={crop}
                      zoom={zoom}
                      rotation={rotation}
                      aspect={currentAspectRatio || undefined}
                      onCropChange={setCrop}
                      onCropAreaChange={handleCropAreaChange}
                      onZoomChange={setZoom}
                      onRotationChange={setRotation}
                      cropShape="rect"
                      showGrid={true}
                      restrictPosition={false}
                    />
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
                    {currentAspectRatio
                      ? `Aspect Ratio: ${currentAspectRatio.toFixed(2)}:1`
                      : "Free aspect ratio"}
                  </p>

                  {/* Aspect Ratio Presets - Mobile Phone Style */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Aspect Ratio
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {ASPECT_RATIOS.map((ratio) => (
                        <button
                          key={ratio.label}
                          onClick={() => setCurrentAspectRatio(ratio.value)}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                            currentAspectRatio === ratio.value
                              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30"
                              : "bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10"
                          }`}
                        >
                          {ratio.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                          Zoom
                        </label>
                        <span className="text-xs font-mono text-indigo-600 dark:text-indigo-400">
                          {zoom.toFixed(2)}x
                        </span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="3"
                        step="0.05"
                        value={zoom}
                        onChange={(e) => setZoom(parseFloat(e.target.value))}
                        className="w-full"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                          Rotate
                        </label>
                        <span className="text-xs font-mono text-indigo-600 dark:text-indigo-400">
                          {rotation}°
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="360"
                        step="1"
                        value={rotation}
                        onChange={(e) =>
                          setRotation(parseFloat(e.target.value))
                        }
                        className="w-full"
                      />
                    </div>

                    <button
                      onClick={() => {
                        setRotation(0);
                        setZoom(1);
                        setCrop({ x: 0, y: 0 });
                      }}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors font-medium"
                    >
                      <RotateCcw size={16} />
                      Reset Crop
                    </button>
                  </div>
                </div>

                {/* Preview */}
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Final Result
                      </label>
                      <span className="text-xs font-mono bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 px-2 py-1 rounded">
                        WYSIWYG
                      </span>
                    </div>
                    {/* Preview container with matching aspect ratio */}
                    <div
                      className="w-full rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border-3 border-indigo-400 dark:border-indigo-500/50 shadow-lg"
                      style={{
                        aspectRatio: currentAspectRatio
                          ? `${currentAspectRatio}`
                          : "auto",
                        maxHeight: "400px",
                      }}
                    >
                      {croppedPreview ? (
                        <img
                          src={croppedPreview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700">
                          <div className="text-center">
                            <div className="text-sm font-medium">
                              Adjust and crop above
                            </div>
                            <div className="text-xs mt-1">
                              Preview updates in real-time
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    {currentAspectRatio && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 text-center">
                        {croppedAreaPixels &&
                          `${Math.round(croppedAreaPixels.width)} × ${Math.round(croppedAreaPixels.height)}px`}
                      </p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-2 pt-4 border-t border-slate-200 dark:border-white/5">
                    <button
                      onClick={() => {
                        setImageSrc(null);
                        if (fileInputRef.current)
                          fileInputRef.current.value = "";
                      }}
                      disabled={isUploading}
                      className="w-full px-4 py-2.5 rounded-lg bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors font-medium disabled:opacity-50"
                    >
                      Change Image
                    </button>
                    <button
                      onClick={handleApplyCrop}
                      disabled={isUploading || !croppedAreaPixels}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-blue-600 text-white hover:from-indigo-700 hover:to-blue-700 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/30"
                    >
                      <Check size={18} />
                      {isUploading ? "Uploading..." : "Apply & Upload"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
