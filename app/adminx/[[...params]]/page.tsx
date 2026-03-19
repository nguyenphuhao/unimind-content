"use client";
import { makePage } from "@keystatic/next/ui/app";
import keystaticConfig from "@/keystatic.config";

// Keystatic's JS hardcodes /keystatic in all router.push() calls.
// We serve the studio at both /adminx (entry point) and /keystatic (internal navigation).
export default makePage(keystaticConfig);
