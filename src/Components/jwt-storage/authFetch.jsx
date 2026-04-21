import { buildUrl } from "../../config/api";

export async function authFetch(url, options = {}) {
  const token = localStorage.getItem("token");
  const fullUrl = buildUrl(url);

  const res = await fetch(fullUrl, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers || {})
    }
  });

  if (res.status === 401 || res.status === 403) {
    localStorage.removeItem("token");
    window.location.reload();
    throw new Error("Unauthorized");
  }

  if (!res.ok) {
    let errorMessage = "Request failed";

    try {
      const contentType = res.headers.get("content-type");
      
      if (contentType && contentType.includes("application/json")) {
        const errData = await res.json();
        errorMessage = errData.message || errData.error || JSON.stringify(errData);
      } else {
        errorMessage = await res.text();
      }
    } catch {
      // If parsing fails, keep default message
    }

    throw new Error(errorMessage);
  }

  if (res.status === 204) {
    return null;
  }

  const contentType = res.headers.get("content-type");

  if (contentType && contentType.includes("application/json")) {
    return res.json();
  }

  return null;
}