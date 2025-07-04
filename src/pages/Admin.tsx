// src/pages/Admin.tsx

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, Lock, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import Footer from "@/components/Footer";

// Ganti dengan sandi yang Anda inginkan
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD;

const AdminPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [appsScriptUrl, setAppsScriptUrl] = useState("");
  const [sheetId, setSheetId] = useState(""); // <-- STATE BARU
  const [sheetName, setSheetName] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      setAppsScriptUrl(localStorage.getItem("apps_script_url") || "");
      setSheetId(localStorage.getItem("google_sheet_id") || ""); // <-- LOAD DATA BARU
      setSheetName(localStorage.getItem("google_sheet_name") || "");
    }
  }, [isAuthenticated]);

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      toast.success("Login sebagai admin berhasil!");
    } else {
      toast.error("Sandi salah!");
    }
  };

  const handleSaveConfig = () => {
    // Validasi URL Apps Script
    if (!appsScriptUrl || !appsScriptUrl.startsWith("https://script.google.com/macros/s/")) {
      toast.error("Format URL Web App sepertinya tidak valid.");
      return;
    }
    
    // Validasi kolom lain
    if (!sheetId || !sheetName) {
      toast.error("Semua kolom konfigurasi harus diisi.");
      return;
    }

    localStorage.setItem("apps_script_url", appsScriptUrl);
    localStorage.setItem("google_sheet_id", sheetId);
    localStorage.setItem("google_sheet_name", sheetName);
    toast.success("Konfigurasi berhasil disimpan!");
  };

  if (!isAuthenticated) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle className="text-2xl">Halaman Admin</CardTitle>
                    <CardDescription>Masukkan sandi untuk melanjutkan.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="password">Sandi</Label>
                        <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                        />
                    </div>
                    <Button onClick={handleLogin} className="w-full">
                        <Lock className="mr-2 h-4 w-4"/>
                        Login
                    </Button>
                </CardContent>
            </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50">
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center mb-8">
                <Button onClick={() => navigate('/')} variant="ghost">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Kembali ke Halaman Utama
                </Button>
            </div>

            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle>Konfigurasi Admin</CardTitle>
                    <CardDescription>Pengaturan ini akan berlaku untuk semua pengguna aplikasi.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="apps-script-url">URL Web App (Google Apps Script)</Label>
                        <Input
                            id="apps-script-url"
                            placeholder="Tempel URL Web App dari Google"
                            value={appsScriptUrl}
                            onChange={(e) => setAppsScriptUrl(e.target.value)}
                        />
                    </div>
                     {/* --- INPUT BARU DITAMBAHKAN DI SINI --- */}
                    <div className="space-y-2">
                        <Label htmlFor="sheet-id">ID Google Spreadsheet</Label>
                        <Input
                            id="sheet-id"
                            placeholder="Tempel ID dari URL Google Sheet"
                            value={sheetId}
                            onChange={(e) => setSheetId(e.target.value)}
                        />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="sheet-name">Nama Sheet/Tab Tujuan</Label>
                        <Input
                            id="sheet-name"
                            placeholder="Contoh: Absensi Peserta"
                            value={sheetName}
                            onChange={(e) => setSheetName(e.target.value)}
                        />
                    </div>
                    <Button onClick={handleSaveConfig}>
                        <Save className="mr-2 h-4 w-4" />
                        Simpan Konfigurasi
                    </Button>
                </CardContent>
            </Card>
        </div>
        <Footer />
    </div>
  );
};

export default AdminPage;