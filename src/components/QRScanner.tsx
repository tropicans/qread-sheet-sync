// src/components/QRScanner.tsx

import { useEffect, useRef, useState } from "react";
import jsQR from "jsqr";
import { Button } from "@/components/ui/button";
import { X, AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface QRScannerProps {
  onClose: () => void;
}

const SCAN_RESOLUTION = 400;

const QRScanner = ({ onClose }: QRScannerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const animationFrameId = useRef<number>();

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = () => {
    if (isProcessing) return;

    const constraints = {
      video: { facingMode: "environment" },
    };

    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((mediaStream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.playsInline = true;
          videoRef.current.play();
          setStream(mediaStream);
          setError("");
          animationFrameId.current = requestAnimationFrame(tick);
        }
      })
      .catch((err) => {
        console.error("Error accessing camera:", err);
        setError("Kamera tidak dapat diakses. Pastikan izin telah diberikan.");
        toast.error("Gagal mengakses kamera");
      });
  };

  const stopCamera = () => {
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
    }
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const sendDataToSheet = async (qrData: string) => {
    setIsProcessing(true);
    cancelAnimationFrame(animationFrameId.current!);

    // Ambil semua konfigurasi dari localStorage
    const appsScriptUrl = localStorage.getItem("apps_script_url");
    const sheetId = localStorage.getItem("google_sheet_id");
    const sheetName = localStorage.getItem("google_sheet_name");

    if (!appsScriptUrl || !sheetId || !sheetName) {
        toast.error("Konfigurasi aplikasi belum lengkap. Harap hubungi admin.");
        setIsProcessing(false);
        // Coba mulai kamera lagi setelah 2 detik
        setTimeout(() => {
            animationFrameId.current = requestAnimationFrame(tick);
        }, 2000);
        return;
    }

    try {
      const response = await fetch(appsScriptUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
            qrData: qrData,
            sheetId: sheetId, // Kirim ID Sheet
            sheetName: sheetName, // Kirim Nama Sheet
        }),
      });

      const result = await response.json();

      if (result.status === 'success') {
        toast.success(result.message);
      } else if (result.status === 'duplicate') {
        toast.warning(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error sending data:", error);
      toast.error("Gagal mengirim data.");
    } finally {
      setTimeout(() => {
        setIsProcessing(false);
        animationFrameId.current = requestAnimationFrame(tick);
      }, 2000);
    }
  };

  const tick = () => {
    if (videoRef.current?.readyState === videoRef.current?.HAVE_ENOUGH_DATA && canvasRef.current && !isProcessing) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext("2d", { willReadFrequently: true });

      if (context) {
        canvas.height = SCAN_RESOLUTION;
        canvas.width = SCAN_RESOLUTION;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: "dontInvert",
        });

        if (code && code.data) {
          sendDataToSheet(code.data);
          return;
        }
      }
    }
    if (!isProcessing) {
        animationFrameId.current = requestAnimationFrame(tick);
    }
  };

  return (
    <div className="relative">
      <div className="relative bg-black rounded-lg overflow-hidden h-80 flex items-center justify-center">
        {error ? (
          <div className="flex flex-col items-center justify-center text-white bg-gray-800 p-4 text-center">
            <AlertCircle className="w-16 h-16 text-red-400 mb-4" />
            <p>{error}</p>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-64 h-64 border-4 border-white/50 rounded-lg shadow-inner" />
            </div>
            {isProcessing && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-black/70">
                <Loader2 className="w-12 h-12 animate-spin" />
              </div>
            )}
          </>
        )}
        <canvas ref={canvasRef} className="hidden" />
      </div>

      <div className="flex justify-center items-center mt-6">
        <Button onClick={onClose} variant="outline" className="w-full">
          <X className="w-4 h-4 mr-2" />
          Tutup Pemindai
        </Button>
      </div>
    </div>
  );
};

export default QRScanner;