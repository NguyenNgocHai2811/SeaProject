const mongoose = require('mongoose');

const MarineSpeciesSchema = new mongoose.Schema({
  name: { type: String, required: true },             // Tên sinh vật
  image: { type: String },                             // URL ảnh
  description: { type: String },                       // Mô tả chi tiết
  distribution: { type: String },                      // Phân bố địa lý
  conservationStatus: { type: String },                // Tình trạng bảo tồn
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('MarineSpecies', MarineSpeciesSchema);
