import React, { useState } from 'react';

export default function CargoLabelApp() {
  const [step, setStep] = useState(1);
  const [palletCount, setPalletCount] = useState(2);
  const [senderName, setSenderName] = useState('');
  const [website, setWebsite] = useState('');
  const [showCustomerNo, setShowCustomerNo] = useState(true);
  const [customerNo, setCustomerNo] = useState('');
  const [pallets, setPallets] = useState([]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const initialPallets = Array.from({ length: palletCount }, (_, i) => ({
      id: i + 1,
      weight: '',
      width: '',
      length: '',
      height: '',
    }));
    setPallets(initialPallets);
    setStep(2);
  };

  const handlePalletChange = (index, field, value) => {
    const updatedPallets = [...pallets];
    updatedPallets[index][field] = value;
    setPallets(updatedPallets);
  };

  const chunkPallets = (arr, size) => {
    return Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
      arr.slice(i * size, i * size + size)
    );
  };

  const palletPages = chunkPallets(pallets, 2);

  return (
    <div className="app-container">
      {step === 1 && (
        <div className="form-card no-print">
          <h2>Kargo Etiket Ayarları (A4 - İkili)</h2>
          <form onSubmit={handleFormSubmit}>
            <label>SENDER (Firma İsmi):</label>
            <input type="text" value={senderName} onChange={(e) => setSenderName(e.target.value)} required placeholder="Örn: ABC LOGISTIC" />
            <label>Palet Sayısı:</label>
            <input type="number" min="1" value={palletCount} onChange={(e) => setPalletCount(Number(e.target.value))} required />
            <label className="checkbox-label">
              <input type="checkbox" checked={showCustomerNo} onChange={(e) => setShowCustomerNo(e.target.checked)} />
              CUSTOMER NO (Müşteri Numarası) Ekle
            </label>
            {showCustomerNo && (
              <div className="fade-in">
                <label>CUSTOMER NO:</label>
                <input type="text" value={customerNo} onChange={(e) => setCustomerNo(e.target.value)} required={showCustomerNo} placeholder="Örn: 123456789" />
              </div>
            )}
            <label>Web Sitesi:</label>
            <input type="text" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="www.abclogistics.com" />
            <button type="submit" className="primary-btn">Palet Detaylarını Gir</button>
          </form>
        </div>
      )}

      {step === 2 && (
        <div className="form-card no-print">
          <h2>Palet Ölçülerini Girin</h2>
          {pallets.map((pallet, index) => (
            <div key={pallet.id} className="pallet-input-group">
              <h3>Palet No: {pallet.id} / {pallets.length}</h3>
              <div className="grid-inputs">
                <input type="number" placeholder="WEIGHT (KG)" value={pallet.weight} onChange={(e) => handlePalletChange(index, 'weight', e.target.value)} required />
                <input type="number" placeholder="En (cm)" value={pallet.width} onChange={(e) => handlePalletChange(index, 'width', e.target.value)} required />
                <input type="number" placeholder="Boy (cm)" value={pallet.length} onChange={(e) => handlePalletChange(index, 'length', e.target.value)} required />
                <input type="number" placeholder="Yükseklik (cm)" value={pallet.height} onChange={(e) => handlePalletChange(index, 'height', e.target.value)} required />
              </div>
            </div>
          ))}
          <div className="action-buttons">
            <button onClick={() => setStep(1)} className="back-btn">Geri Dön</button>
            <button onClick={() => setStep(3)} className="primary-btn">Önizlemeyi Gör</button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="print-bar no-print">
          <button onClick={() => setStep(2)} className="back-btn">← Düzenle</button>
          <button onClick={() => window.print()} className="print-btn">🖨️ Yazdır / PDF Kaydet</button>
        </div>
      )}

      {step === 3 && (
        <div className="a4-print-area">
          {palletPages.map((pageLabels, pageIndex) => (
            <div key={pageIndex} className="a4-page">
              {pageLabels.map((pallet) => (
                <div key={pallet.id} className="logistic-table-container">
                  <table className="logistic-table">
                    <tbody>
                      {showCustomerNo && customerNo && (
                        <tr>
                          <td className="cell-title">CUSTOMER NO</td>
                          <td className="cell-value value-bold">{customerNo}</td>
                        </tr>
                      )}
                      <tr>
                        <td className="cell-title">PALET NO</td>
                        <td className="cell-value value-bold">{pallet.id} / {pallets.length}</td>
                      </tr>
                      <tr>
                        <td className="cell-title">SENDER</td>
                        <td className="cell-value value-bold">{senderName || "ABC LOGISTIC"}</td>
                      </tr>
                      <tr>
                        <td className="cell-title">SIZE</td>
                        <td className="cell-value value-bold">{pallet.width}X{pallet.length}X{pallet.height}</td>
                      </tr>
                      <tr>
                        <td className="cell-title">WEIGHT</td>
                        <td className="cell-value value-bold">{pallet.weight} KG</td>
                      </tr>
                      <tr>
                        <td colSpan="2" className="table-footer-website">{website || "www.abclogistics.com"}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}