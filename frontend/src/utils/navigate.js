// Simple event-based navigation — works from any component without prop drilling
// Usage: import { navigate } from "../utils/navigate";
//        navigate("contact");

export function navigate(page) {
  window.dispatchEvent(new CustomEvent("hv:navigate", { detail: { page } }));
}
