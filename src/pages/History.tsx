// src/pages/History.tsx

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, QrCode, CheckCircle, XCircle, Calendar, Clock, ExternalLink, Trash2 } from "lucide-react";
import Footer from "@/components/Footer";

// Definisikan tipe untuk entri riwayat
interface HistoryEntry {
  id: number;
  qrData: string;
  timestamp: string;
  status: "success" | "failed";
  sheetUpdated: boolean;
  type: string;
}


const History = () => {
  const navigate = useNavigate();
  const [historyData, setHistoryData] = useState<HistoryEntry[]>([]);
  const [stats, setStats] = useState({ success: 0, failed: 0, synced: 0 });

  useEffect(() => {
    const storedHistory = JSON.parse(localStorage.getItem("scan_history") || "[]");
    setHistoryData(storedHistory);

    // Hitung statistik
    const successCount = storedHistory.filter((item: HistoryEntry) => item.status === 'success').length;
    const failedCount = storedHistory.filter((item: HistoryEntry) => item.status === 'failed').length;
    const syncedCount = storedHistory.filter((item: HistoryEntry) => item.sheetUpdated).length;
    setStats({ success: successCount, failed: failedCount, synced: syncedCount });
  }, []);

  const clearHistory = () => {
    if (window.confirm("Apakah Anda yakin ingin menghapus semua riwayat pemindaian?")) {
        localStorage.removeItem("scan_history");
        setHistoryData([]);
        setStats({ success: 0, failed: 0, synced: 0 });
    }
  }


  const getStatusIcon = (status: string) => {
    return status === "success" ? (
      <CheckCircle className="w-5 h-5 text-success" />
    ) : (
      <XCircle className="w-5 h-5 text-destructive" />
    );
  };

  const getStatusBadge = (status: string) => {
    return status === "success" ? (
      <Badge className="bg-success/10 text-success hover:bg-success/20">
        Berhasil
      </Badge>
    ) : (
      <Badge variant="destructive">
        Gagal
      </Badge>
    );
  };

  const getTypeBadge = (type: string) => {
    const colors: { [key: string]: string } = {
      "URL": "bg-blue-100 text-blue-800",
      "Teks": "bg-gray-100 text-gray-800",
    };
    
    return (
      <Badge className={`${colors[type] || "bg-gray-100 text-gray-800"}`}>
        {type}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-green-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Button
              onClick={() => navigate("/")}
              variant="ghost"
              className="mr-4"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Kembali
            </Button>
            <div className="flex items-center">
              <QrCode className="w-8 h-8 text-primary mr-3" />
              <h1 className="text-2xl font-bold text-gray-800">Riwayat Pemindaian</h1>
            </div>
          </div>
           {historyData.length > 0 && (
            <Button onClick={clearHistory} variant="destructive" size="sm">
                <Trash2 className="w-4 h-4 mr-2" />
                Hapus Riwayat
            </Button>
           )}
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="animate-fade-in">
            <CardContent className="p-6 text-center">
              <div className="bg-success/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-success" />
              </div>
              <h3 className="text-2xl font-bold text-success mb-1">{stats.success}</h3>
              <p className="text-sm text-gray-600">Berhasil</p>
            </CardContent>
          </Card>
          
          <Card className="animate-fade-in">
            <CardContent className="p-6 text-center">
              <div className="bg-destructive/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <XCircle className="w-8 h-8 text-destructive" />
              </div>
              <h3 className="text-2xl font-bold text-destructive mb-1">{stats.failed}</h3>
              <p className="text-sm text-gray-600">Gagal</p>
            </CardContent>
          </Card>
          
          <Card className="animate-fade-in">
            <CardContent className="p-6 text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <ExternalLink className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-blue-600 mb-1">{stats.synced}</h3>
              <p className="text-sm text-gray-600">Tersinkron</p>
            </CardContent>
          </Card>
        </div>

        {/* History List */}
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Riwayat Lengkap
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {historyData.map((item) => (
                <div
                  key={item.id}
                  className="border rounded-lg p-6 hover:shadow-md transition-all duration-200 bg-white"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(item.status)}
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          {getStatusBadge(item.status)}
                          {getTypeBadge(item.type)}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="w-4 h-4 mr-1" />
                          {item.timestamp}
                        </div>
                      </div>
                    </div>
                    {item.sheetUpdated && (
                      <Badge className="bg-green-100 text-green-700">
                        <ExternalLink className="w-3 h-3 mr-1" />
                        Sheet Updated
                      </Badge>
                    )}
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm font-medium text-gray-700 mb-1">Data QR Code:</p>
                    <code className="text-sm text-gray-600 break-all">
                      {item.qrData}
                    </code>
                  </div>
                </div>
              ))}
            </div>
            
            {historyData.length === 0 && (
              <div className="text-center py-12">
                <QrCode className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-500 mb-2">
                  Belum ada riwayat pemindaian
                </h3>
                <p className="text-gray-400 mb-6">
                  Mulai pindai QR code untuk melihat riwayat di sini
                </p>
                <Button onClick={() => navigate("/")} className="bg-primary hover:bg-primary/90">
                  Mulai Pemindaian
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Footer />
    </div>
  );
};

export default History;