"use client";

import { useActionState, useEffect, useState, useRef } from "react"; // Tambah useRef
import { useRouter } from "next/navigation";
import {
  submitStudentReview,
  type ReviewFormState,
} from "./actions";

const initialState: ReviewFormState = {};

const inputClass =
  "mt-2 w-full rounded-xl border border-line bg-mist/30 px-4 py-3 text-sm text-ink outline-none transition focus:border-batik focus:bg-white focus:ring-4 focus:ring-batik/10";

export default function ReviewForm() {
  const [state, formAction, pending] = useActionState(
    submitStudentReview,
    initialState,
  );
  const [photoPreview, setPhotoPreview] = useState("");
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const router = useRouter();
  
  // Ref untuk menunjuk ke elemen form
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok) {
      // Reset state preview foto dan rating
      setPhotoPreview("");
      setRating(5);
      
      // Reset form secara fisik (menghapus isi input, termasuk file)
      formRef.current?.reset();
      
      router.refresh();
    }
  }, [state.ok, router]);

  useEffect(() => {
    return () => {
      if (photoPreview) URL.revokeObjectURL(photoPreview);
    };
  }, [photoPreview]);

  function handlePhotoChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];
    setPhotoPreview(file ? URL.createObjectURL(file) : "");
  }

  return (
    <div className="rounded-3xl border border-line bg-white p-6 shadow-xl shadow-batik/5 md:p-8">
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-widest text-batik-soft">
          Bagikan Pengalamanmu
        </p>
        <h2 className="mt-2 text-2xl font-bold text-ink">
          Tulis Ulasan
        </h2>
        <p className="mt-2 text-sm text-muted">
          Ulasan akan ditampilkan di website setelah dikirim.
        </p>
      </div>

      {state.ok && (
        <div role="status" className="mb-5 rounded-xl border border-ok/30 bg-ok/10 p-4 text-sm font-medium text-ok">
          {state.message}
        </div>
      )}

      {state.error && (
        <div role="alert" className="mb-5 rounded-xl border border-danger/30 bg-danger/10 p-4 text-sm font-medium text-danger">
          {state.error}
        </div>
      )}

      {/* Tambahkan ref={formRef} di sini */}
      <form ref={formRef} action={formAction} className="space-y-5">
        {/* Honeypot */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
          <label htmlFor="review-website">Website</label>
          <input id="review-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="review-name" className="text-sm font-bold text-ink">Nama *</label>
            <input id="review-name" name="name" required maxLength={100} defaultValue={state.values?.name ?? ""} placeholder="Nama kamu" className={inputClass} />
            {state.fieldErrors?.name && <p className="mt-1 text-sm text-danger">{state.fieldErrors.name}</p>}
          </div>

          <div>
            <label htmlFor="review-role" className="text-sm font-bold text-ink">Status / Program</label>
            <input id="review-role" name="role" maxLength={100} defaultValue={state.values?.role ?? ""} placeholder="Contoh: Alumni program Jepang" className={inputClass} />
            {state.fieldErrors?.role && <p className="mt-1 text-sm text-danger">{state.fieldErrors.role}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="review-company" className="text-sm font-bold text-ink">Perusahaan / Instansi</label>
          <input id="review-company" name="company" maxLength={120} defaultValue={state.values?.company ?? ""} placeholder="Contoh: RS Harapan Bunda" className={inputClass} />
          {state.fieldErrors?.company && <p className="mt-1 text-sm text-danger">{state.fieldErrors.company}</p>}
        </div>

        {/* BINTANG RATING INTERAKTIF */}
        <div>
          <label className="text-sm font-bold text-ink">Rating *</label>
          <input type="hidden" name="rating" value={rating} />
          
          <div className="mt-2 flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="focus:outline-none transition-transform hover:scale-110 active:scale-95"
                aria-label={`Beri ${star} bintang`}
              >
                <svg
                  className={`w-9 h-9 transition-colors ${
                    star <= (hoverRating || rating)
                      ? "text-kunyit fill-kunyit drop-shadow-sm"
                      : "text-line fill-transparent"
                  }`}
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                </svg>
              </button>
            ))}
            <span className="ml-2 text-sm font-medium text-muted">
              {rating === 5 ? "Sangat Puas" : rating === 4 ? "Puas" : rating === 3 ? "Cukup" : rating === 2 ? "Kurang" : "Buruk"}
            </span>
          </div>
          {state.fieldErrors?.rating && <p className="mt-1 text-sm text-danger">{state.fieldErrors.rating}</p>}
        </div>

        <div>
          <label htmlFor="review-photo" className="text-sm font-bold text-ink">Foto Profil (Opsional)</label>
          {/* Pastikan input file di-reset dengan form reset */}
          <input id="review-photo" name="photo" type="file" accept="image/jpeg,image/png,image/webp" onChange={handlePhotoChange} className={`${inputClass} file:mr-4 file:rounded-lg file:border-0 file:bg-batik file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white`} />
          <p className="mt-1 text-xs text-muted">JPG, PNG, atau WebP. Maks 3 MB.</p>

          {photoPreview && (
            <div className="mt-4 flex items-center gap-4">
              <img src={photoPreview} alt="Pratinjau" className="h-16 w-16 rounded-full border-2 border-line object-cover" />
              <span className="text-sm text-muted">Foto siap diunggah</span>
            </div>
          )}
          {state.fieldErrors?.photo && <p className="mt-1 text-sm text-danger">{state.fieldErrors.photo}</p>}
        </div>

        <div>
          <label htmlFor="review-quote" className="text-sm font-bold text-ink">Ulasan Kamu *</label>
          <textarea id="review-quote" name="quote" required minLength={10} maxLength={500} rows={5} defaultValue={state.values?.quote ?? ""} placeholder="Ceritakan pengalamanmu selama mengikuti program..." className={inputClass} />
          <p className="mt-1 text-xs text-muted">Minimal 10 karakter.</p>
          {state.fieldErrors?.quote && <p className="mt-1 text-sm text-danger">{state.fieldErrors.quote}</p>}
        </div>

        <button type="submit" disabled={pending} className="group relative inline-flex w-full items-center justify-center overflow-hidden rounded-xl bg-batik px-8 py-3.5 font-bold text-white shadow-lg shadow-batik/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-batik-soft disabled:opacity-70">
          {pending ? "Mengirim..." : "Kirim Ulasan"}
          {!pending && (
            <svg className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          )}
        </button>
      </form>
    </div>
  );
}