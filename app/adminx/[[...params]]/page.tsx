import { redirect } from "next/navigation";

// Keystatic is hardcoded to use /keystatic as its base path.
// This redirect keeps any bookmarked /adminx links working.
export default function AdminxRedirect({
  params,
}: {
  params: { params?: string[] };
}) {
  const rest = params.params?.join("/") ?? "";
  redirect(rest ? `/keystatic/${rest}` : "/keystatic");
}
