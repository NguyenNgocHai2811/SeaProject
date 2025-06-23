// public/js/speciesUI.js

const speciesContainer = document.getElementById('species-container');
const paginationContainer = document.getElementById('pagination');
const limit = 12;

function createCard(item) {
  const card = document.createElement('a');
  card.className = 'species-card';
  card.href = `/species/${item._id}`;
  card.style.textDecoration = 'none';
  card.style.color = 'inherit';
  card.innerHTML = `
    <img src="${item.image || '/images/default.jpg'}" alt="${item.name}">
    <h3>${item.name}</h3>
    <p><strong>Mô tả:</strong> ${item.description || 'Không có mô tả'}</p>
    <p><strong>Phân bố:</strong> ${item.distribution || 'Không rõ'}</p>
    <p><strong>Tình trạng:</strong> ${item.conservationStatus || 'Không rõ'}</p>
  `;
  return card;
}

function renderPagination(totalPages, page) {
  if (!paginationContainer) return;
  paginationContainer.innerHTML = '';

  if (page > 1) {
    const prev = document.createElement('button');
    prev.textContent = 'Previous';
    prev.onclick = () => loadSpecies(page - 1);
    paginationContainer.appendChild(prev);
  }

  for (let p = 1; p <= totalPages; p++) {
    const btn = document.createElement('button');
    btn.textContent = p;
    if (p === page) btn.disabled = true;
    btn.onclick = () => loadSpecies(p);
    paginationContainer.appendChild(btn);
  }

  if (page < totalPages) {
    const next = document.createElement('button');
    next.textContent = 'Next';
    next.onclick = () => loadSpecies(page + 1);
    paginationContainer.appendChild(next);
  }
}

function loadSpecies(page = 1) {
  if (!speciesContainer) return;
  fetch(`/api/species/readAll?page=${page}&limit=${limit}`)
    .then(res => res.json())
    .then(data => {
      speciesContainer.innerHTML = '';
      data.species.forEach(item => {
        speciesContainer.appendChild(createCard(item));
      });
      renderPagination(data.totalPages, data.page);
    })
    .catch(err => {
      speciesContainer.innerHTML = '<p>Lỗi khi tải dữ liệu.</p>';
      console.error('[ERROR] Khi gọi API /api/species:', err);
    });
}

if (speciesContainer && paginationContainer) {
  loadSpecies();
}
