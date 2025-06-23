// public/js/speciesUI.js

const speciesContainer = document.getElementById('species-container');
if (speciesContainer) {
  fetch('/api/species/readAll')
    .then(res => res.json())
    .then(data => {
      data.forEach(item => {
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
        speciesContainer.appendChild(card);
      });
    })
    .catch(err => {
      speciesContainer.innerHTML = '<p>Lỗi khi tải dữ liệu.</p>';
      console.error('[ERROR] Khi gọi API /api/species:', err);
    });
}
