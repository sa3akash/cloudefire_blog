import { getDb, users } from "@/lib/db";
import { count } from "drizzle-orm";
import { redirect } from "next/navigation";
import { SetupForm } from "./setup-form";

export default async function AdminSetupPage() {
  const db = getDb();
  const existingUsers = await db.select({ count: count() }).from(users);

  // If administrator already exists, setup is closed
  if (existingUsers[0]?.count > 0) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/20">
      <SetupForm />
    </div>
  );
}
