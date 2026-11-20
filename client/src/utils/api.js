// Small wrapper around fetch used by every page.
// - sends the logged-in user's id in the x-user-id header (basic authentication)
// - turns server error messages into thrown Errors so pages can show them

export const STORAGE_KEY = 'alzikrayat_user';

function authHeaders() {
  try {
    const user = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return user && user._id ? { 'x-user-id': user._id } : {};
  } catch {
    return {};
  }
}

async function request(path, { method = 'GET', body, form } = {}) {
  const headers = { ...authHeaders() };
  let payload;

  if (form) {
    payload = form; // FormData: the browser sets the multipart Content-Type itself
  } else if (body) {
    headers['Content-Type'] = 'application/json';
    payload = JSON.stringify(body);
  }

  let res;
  try {
    res = await fetch(`/api${path}`, { method, headers, body: payload });
  } catch {
    throw new Error('Cannot reach the server. Make sure the API is running.');
  }

  if (res.status === 204) return null;

  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error((data && data.message) || `Request failed (${res.status})`);
  return data;
}

export const api = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: 'POST', body }),
  upload: (path, form) => request(path, { method: 'POST', form }),
  delete: (path) => request(path, { method: 'DELETE' }),
};

export const imageUrl = (fileName) => `/uploads/${fileName}`;
