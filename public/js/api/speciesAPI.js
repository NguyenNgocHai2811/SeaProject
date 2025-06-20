// Gọi API từ server
export async function fetchSpecies() {
  const res = await fetch('/api/species');
  return await res.json();
}
