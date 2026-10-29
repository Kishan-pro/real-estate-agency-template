import { supabase } from "@/lib/supabase";
import { getVisitorId } from "@/lib/tracking";

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign"];

function getUtm() {
  const params = new URLSearchParams(window.location.search);
  return Object.fromEntries(UTM_KEYS.map((k) => [k, params.get(k)]).filter(([, v]) => v));
}

export async function submitLead(lead) {
  if (!supabase) return { error: new Error("Supabase is not configured") };
  const phone = lead.phone.replace(/[^\d+]/g, "");
  if (phone.replace(/\D/g, "").length < 10) {
    return { error: new Error("Please enter a valid phone number.") };
  }
  return supabase.from("leads").insert({ ...lead, phone, ...getUtm(), visitor_id: getVisitorId(), source: "form" });
}
