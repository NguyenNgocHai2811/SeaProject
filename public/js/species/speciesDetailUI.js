const container = document.getElementById('species-detail');

function render(species) {
  if (!container) return;
  container.innerHTML = `
    <h2>${species.name}</h2>
    <img src="${species.image || '/images/default.jpg'}" alt="${species.name}" style="max-width:100%;border-radius:10px;">
    <p><strong>Mô tả:</strong> ${species.description || 'Không có mô tả'}</p>
    <p><strong>Phân bố:</strong> ${species.distribution || 'Không rõ'}</p>
    <p><strong>Tình trạng:</strong> ${species.conservationStatus || 'Không rõ'}</p>
  `;
}

const id = window.location.pathname.split('/').pop();
fetch(`/api/species/readOne/${id}`)
  .then(res => res.json())
  .then(render)
  .catch(err => {
    console.error('Lỗi khi tải chi tiết:', err);
    if (container) container.innerHTML = '<p>Không tìm thấy thông tin.</p>';
  });
