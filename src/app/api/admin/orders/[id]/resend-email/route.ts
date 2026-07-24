import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getSession } from "@/lib/auth";
import { hasPermission } from "@/lib/rbac";
import { getDb } from "@/lib/mongodb";
import { getBookFileKey } from "@/lib/models/Book";
import { getPresignedDownloadUrl } from "@/lib/r2";
import { sendPurchaseEmail } from "@/lib/email";

const DOWNLOAD_LINK_EXPIRY_SECONDS = 60 * 60 * 2; // 2 hours

/**
 * Manually re-sends the purchase-confirmation/download-link email for a
 * given order — the recovery path for when the automatic webhook email
 * fails to send (e.g. an email-provider quota or transient error).
 */
export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!hasPermission(session?.role, "manageOrders")) {
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });
  }

  const { id } = await params;
  const db = await getDb();
  const order = await db.collection("orders").findOne({ _id: new ObjectId(id) });

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }
  if (order.status !== "paid") {
    return NextResponse.json({ error: "Only paid orders can be resent" }, { status: 400 });
  }
  if (!order.customerEmail || order.customerEmail === "unknown") {
    return NextResponse.json({ error: "No customer email on this order" }, { status: 400 });
  }

  const fileKey = await getBookFileKey(order.bookId);
  if (!fileKey) {
    return NextResponse.json({ error: "No deliverable file set for this book yet" }, { status: 400 });
  }

  try {
    const downloadUrl = await getPresignedDownloadUrl(fileKey, DOWNLOAD_LINK_EXPIRY_SECONDS);
    await sendPurchaseEmail({
      to: order.customerEmail,
      customerName: order.customerName,
      bookTitle: order.bookTitle,
      downloadUrl,
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to send email";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
