import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-midnight flex flex-col items-center justify-center text-center p-6 text-white font-inter">
      <h1 className="text-6xl font-extrabold text-electric-purple font-poppins mb-2">404</h1>
      <h2 className="text-xl font-bold mb-4">Halaman Tidak Ditemukan</h2>
      <p className="text-soft-gray mb-6 max-w-md">
        Maaf, halaman atau anime yang Anda cari tidak tersedia atau telah dipindahkan.
      </p>
      <Link
        href="/"
        className="px-6 py-2.5 rounded-full bg-gradient-brand text-white font-semibold shadow-glow-purple hover:scale-105 transition-all text-sm"
      >
        Kembali ke Beranda
      </Link>
    </div>
  );
}
