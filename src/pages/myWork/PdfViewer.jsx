import React, { useState, useRef, useEffect } from "react";
import SignatureCanvas from "react-signature-canvas";
import {
  FileText,
  Upload,
  CheckCircle,
  Trash2,
  PenTool,
  Download,
} from "lucide-react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

// Configure PDF worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const PdfViewer = () => {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [status, setStatus] = useState("Draft");
  const [numPages, setNumPages] = useState(null);
  const [signatureData, setSignatureData] = useState(null); // To store the saved signature image
  const sigCanvas = useRef(null);

  // Resize canvas handler
  useEffect(() => {
    const resizeCanvas = () => {
      if (sigCanvas.current) {
        const canvas = sigCanvas.current.getCanvas();
        const ratio = Math.max(window.devicePixelRatio || 1, 1);
        canvas.width = canvas.offsetWidth * ratio;
        canvas.height = canvas.offsetHeight * ratio;
        canvas.getContext("2d").scale(ratio, ratio);
        sigCanvas.current.clear(); // Clear to prevent stretching
      }
    };

    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, [file]);

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      setPreviewUrl(URL.createObjectURL(uploadedFile));
      setStatus("In Review");
      setSignatureData(null);
    }
  };

  const clearSignature = () => sigCanvas.current.clear();

  // Save/Sign Document
  const handleSign = () => {
    if (sigCanvas.current.isEmpty()) {
      alert("Please provide a signature first.");
      return;
    }
    setStatus("Signed");
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans text-slate-900">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Document Chamber
            </h1>
            <p className="text-slate-500">
              Upload, review, and finalize your business contracts.
            </p>
          </div>
          <div
            className={`px-4 py-1 rounded-full text-sm font-bold border transition-all ${
              status === "Signed"
                ? "bg-green-100 text-green-700 border-green-200"
                : status === "In Review"
                  ? "bg-blue-100 text-blue-700 border-blue-200"
                  : "bg-gray-100 text-gray-600"
            }`}
          >
            ● {status}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT: Upload & Preview Section */}
          <div className="lg:col-span-2 space-y-6">
            {!file ? (
              <div className="border-2 border-dashed border-slate-300 rounded-3xl p-12 flex flex-col items-center justify-center bg-white hover:border-blue-400 transition-all cursor-pointer relative group">
                <input
                  type="file"
                  accept="application/pdf,image/*"
                  onChange={handleFileUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <div className="bg-blue-50 p-4 rounded-2xl mb-4 text-blue-600 group-hover:scale-110 transition-transform">
                  <Upload size={32} />
                </div>
                <p className="font-bold text-lg">Click to upload document</p>
                <p className="text-sm text-slate-400 font-medium">
                  PDF or Images only (Max 10MB)
                </p>
              </div>
            ) : (
              <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                <div className="p-4 border-b flex justify-between items-center bg-slate-50">
                  <div className="flex items-center gap-2">
                    <FileText className="text-blue-600" size={20} />
                    <span className="font-medium text-sm truncate max-w-[300px]">
                      {file.name}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setFile(null);
                      setStatus("Draft");
                    }}
                    className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                {/* Scrollable Preview Area */}
                <div className="h-[700px] bg-slate-200 flex justify-center overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-slate-400">
                  {file.type.startsWith("image") ? (
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="max-w-full h-fit shadow-lg rounded"
                    />
                  ) : file.type === "application/pdf" ? (
                    <Document
                      file={previewUrl}
                      onLoadSuccess={onDocumentLoadSuccess}
                      className="flex flex-col items-center"
                    >
                      {Array.from(new Array(numPages), (el, index) => (
                        <Page
                          key={`page_${index + 1}`}
                          pageNumber={index + 1}
                          width={600}
                          className="mb-6 shadow-xl"
                          renderAnnotationLayer={false}
                          renderTextLayer={false}
                        />
                      ))}
                    </Document>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-slate-500">
                      <FileText size={48} className="mb-2 opacity-20" />
                      <p>Preview unavailable</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: E-Signature Pad & Actions */}
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm sticky top-8">
              <div className="flex items-center gap-2 mb-4 text-slate-800">
                <PenTool size={20} className="text-blue-600" />
                <h3 className="font-bold">E-Signature Pad</h3>
              </div>

              <div className="border border-slate-200 rounded-xl bg-slate-50 mb-4 overflow-hidden relative">
                {status === "Signed" && signatureData ? (
                  <div className="h-48 flex items-center justify-center bg-white p-4">
                    <img
                      src={signatureData}
                      alt="Signature"
                      className="max-h-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="border border-slate-200 rounded-xl bg-white mb-4">
                    <SignatureCanvas
                      ref={sigCanvas}
                      penColor="black"
                      canvasProps={{
                        // This style object is CRITICAL for the library to work
                        style: {
                          width: "100%",
                          height: "200px",
                          display: "block",
                        },
                        className: "sigCanvas",
                      }}
                    />
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex gap-2">
                  <button
                    onClick={clearSignature}
                    className="flex-1 py-2 text-sm font-semibold text-slate-500 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200"
                  >
                    Clear
                  </button>
                  <button
                    onClick={handleSign}
                    disabled={status === "Signed" || !file}
                    className="flex-1 py-2 text-sm font-bold bg-slate-900 text-white rounded-xl hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {status === "Signed"
                      ? "Signature Applied"
                      : "Apply Signature"}
                  </button>
                </div>

                {status === "Signed" && (
                  <button
                    className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 shadow-lg shadow-blue-100"
                    onClick={() => alert("Ready to download final PDF!")}
                  >
                    <Download size={18} /> Download Signed File
                  </button>
                )}
              </div>

              {/* Checklist Box */}
              <div className="mt-8 bg-slate-900 rounded-2xl p-5 text-white">
                <h3 className="font-bold mb-4 flex items-center gap-2 text-blue-400">
                  <CheckCircle size={18} /> Requirements
                </h3>
                <ul className="text-xs space-y-4">
                  <li
                    className={`flex items-center gap-3 ${file ? "opacity-100" : "opacity-50"}`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center ${file ? "bg-blue-500 border-blue-500" : "border-slate-600"}`}
                    >
                      {file && "✓"}
                    </div>
                    Upload contract
                  </li>
                  <li
                    className={`flex items-center gap-3 ${status === "Signed" ? "opacity-100" : "opacity-50"}`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center ${status === "Signed" ? "bg-blue-500 border-blue-500" : "border-slate-600"}`}
                    >
                      {status === "Signed" && "✓"}
                    </div>
                    Digital signature
                  </li>
                  <li className="flex items-center gap-3 opacity-50">
                    <div className="w-5 h-5 rounded-full border border-slate-600 flex items-center justify-center" />
                    Notify partners
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PdfViewer;
