"use client";

import { useEffect, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";

interface QrModalProps {
  tableId: string;
  tableNumber: number;
  onClose: () => void;
}

function QrModal({ tableId, tableNumber, onClose }: QrModalProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  // Generate the URL based on the current window location
  const menuUrl = typeof window !== "undefined" ? `${window.location.origin}/menu/${tableId}` : "";

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  function handleDownload() {
    const container = containerRef.current;
    if (!container) return;
    
    const canvas = container.querySelector("canvas");
    if (!canvas) return;

    const pngUrl = canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");
    const downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = `QR_Ban_${tableNumber}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="glass-strong w-full max-w-sm p-6 relative flex flex-col items-center gap-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-900"
          style={{ fontSize: 20, width: 24, height: 24, lineHeight: 1 }}
        >
          ✕
        </button>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--text-primary)" }}>
          QR Code Bàn {tableNumber}
        </h3>
        
        <div ref={containerRef} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <QRCodeCanvas
            value={menuUrl}
            size={200}
            bgColor={"#ffffff"}
            fgColor={"#1c1008"}
            level={"H"}
            includeMargin={false}
          />
        </div>
        
        <p style={{ fontSize: 12, color: "var(--text-muted)", textAlign: "center" }}>
          Khách hàng có thể quét mã QR này để truy cập menu và đặt món.
        </p>

        <div className="flex gap-2 w-full mt-2">
          <button
            onClick={handleDownload}
            className="btn-amber flex-1"
            style={{ padding: "10px 0" }}
          >
            ⬇️ Tải mã QR
          </button>
          
          <a
            href={menuUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost flex-1 text-center"
            style={{ padding: "10px 0", textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}
          >
            🔗 Mở link
          </a>
        </div>
      </div>
    </div>
  );
}

export default QrModal;
