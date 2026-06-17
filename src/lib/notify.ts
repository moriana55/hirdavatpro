// Admin bildirim stub'ı — gerçek e-posta sağlayıcısı (Resend/SES/SMTP) bağlanana kadar
// sadece sunucu loguna yazar. Build'i yeşil tutar, anahtar gerektirmez.
//
// TODO(owner): Gerçek e-posta için bir sağlayıcı bağla:
//   - Resend:  RESEND_API_KEY env + `resend.emails.send(...)`
//   - SMTP:    nodemailer + SMTP_* env
// Aşağıdaki fonksiyon imzası korunursa çağıran kodu değiştirmeye gerek kalmaz.

export interface AdminNotification {
  subject: string;
  body: string;
  // İlgili kayıt (teklif/başvuru) için referans — log/iz takibi.
  meta?: Record<string, unknown>;
}

const ADMIN_EMAIL = process.env.ADMIN_NOTIFY_EMAIL || "admin@hirdavatpro.com";

export async function notifyAdmin(n: AdminNotification): Promise<{ delivered: boolean }> {
  // Gerçek sağlayıcı yoksa graceful fallback: logla, çağıran akışı bozma.
  try {
    // eslint-disable-next-line no-console
    console.log(
      `[notifyAdmin → ${ADMIN_EMAIL}] ${n.subject}\n${n.body}` +
        (n.meta ? `\nmeta: ${JSON.stringify(n.meta)}` : "")
    );
    return { delivered: false }; // stub: henüz gerçekten gönderilmedi
  } catch {
    return { delivered: false };
  }
}
