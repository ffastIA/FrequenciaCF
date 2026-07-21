const BASE_URL = import.meta.env.VITE_API_URL;

export async function get(path, params = {}) {
  const url = new URL(BASE_URL + path);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, value);
    }
  });

  const response = await fetch(url);
  const body = await response.json();

  if (!response.ok) {
    throw new Error(body.erro || 'Erro ao consultar a API');
  }

  return body;
}

export async function put(path, body = {}) {
  const url = new URL(BASE_URL + path);

  const response = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const responseBody = await response.json();

  if (!response.ok) {
    throw new Error(responseBody.erro || 'Erro ao gravar na API');
  }

  return responseBody;
}
