// src/pages/Index.tsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { QrCode, ScanQrCode, History } from "lucide-react";
import QRScanner from "@/components/QRScanner";
import Footer from "@/components/Footer";
import { toast } from "sonner";

const Index = () => {
  const [isScanning, setIsScanning] = useState(false);
  const navigate = useNavigate();

  const handleStartScan = () => {
    // Pengguna bisa langsung memindai. Pengecekan konfigurasi dilakukan di dalam QRScanner.
    setIsScanning(true);
  };

  // Jika sedang memindai, tampilkan hanya komponen QRScanner
  if (isScanning) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-lg mx-auto">
          <CardContent className="p-6">
            <QRScanner onClose={() => setIsScanning(false)} />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Tampilan Halaman Utama untuk Pengguna
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-green-50">
      <div className="container mx-auto px-4 py-8 text-center">
        {/* Header */}
        <div className="mb-12 animate-fade-in">
          <div className="flex items-center justify-center mb-4">
            <QrCode className="w-16 h-16 text-primary mr-4" />
            <h1 className="text-5xl font-bold text-gray-800">QRead</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Pindai QR Code. Data langsung terkirim ke Google Sheet.
          </p>
        </div>

        {/* Tombol Aksi Utama */}
        <div className="mb-12 animate-scale-in">
          <Button
            onClick={handleStartScan}
            className="h-20 w-full max-w-md text-2xl bg-primary hover:bg-primary/90 rounded-full shadow-lg"
          >
            <ScanQrCode className="w-8 h-8 mr-4" />
            Mulai Memindai
          </Button>
        </div>

        {/* Tombol ke Riwayat */}
        <div className="animate-fade-in">
          <Button
            onClick={() => navigate("/history")}
            variant="link"
            className="text-gray-600"
          >
            <History className="w-4 h-4 mr-2" />
            Lihat Riwayat Pemindaian
          </Button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Index;