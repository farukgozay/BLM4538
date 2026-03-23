/**
 * ShotForge - Yardımcı Fonksiyonlar (Helpers)
 * 
 * Uygulama genelinde kullanılan yardımcı
 * fonksiyonlar burada tanımlanır.
 */

/**
 * Yüzdelik hesaplama
 * @param {number} made - Başarılı atış sayısı
 * @param {number} total - Toplam atış sayısı
 * @returns {string} Yüzdelik değer (ör: "45.2")
 */
export const calculatePercentage = (made, total) => {
  if (total === 0) return '0.0';
  return ((made / total) * 100).toFixed(1);
};

/**
 * İsmi baş harflere kısalt
 * @param {string} name - Tam isim
 * @returns {string} Baş harfler (ör: "LJ")
 */
export const getInitials = (name) => {
  if (!name) return '??';
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

/**
 * Tarihi formatla
 * @param {string} dateString - ISO tarih string
 * @returns {string} Formatlanmış tarih (ör: "23 Mar 2026")
 */
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const months = [
    'Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz',
    'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara',
  ];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
};

/**
 * İstatistik değerini renklendir
 * @param {number} value - İstatistik değeri
 * @param {string} type - İstatistik türü
 * @returns {string} Uygun renk kodu
 */
export const getStatColor = (value, type) => {
  switch (type) {
    case 'percentage':
      if (value >= 50) return '#00E676';
      if (value >= 40) return '#FFD740';
      return '#FF5252';
    case 'points':
      if (value >= 20) return '#00E676';
      if (value >= 10) return '#FFD740';
      return '#FF5252';
    default:
      return '#FFFFFF';
  }
};

/**
 * API hata mesajını çıkar
 * @param {Error} error - Axios hata objesi
 * @returns {string} Kullanıcıya gösterilecek hata mesajı
 */
export const getErrorMessage = (error) => {
  if (error.response) {
    // Sunucu yanıtı ile hata
    return error.response.data?.message || 'Sunucu hatası oluştu.';
  } else if (error.request) {
    // İstek gönderildi ama yanıt alınamadı
    return 'Sunucuya bağlanılamıyor. İnternet bağlantınızı kontrol edin.';
  }
  return 'Beklenmeyen bir hata oluştu.';
};
