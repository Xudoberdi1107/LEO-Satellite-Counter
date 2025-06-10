import React, { useState } from "react";
// React kutubxonasidan kerakli hook - useState ni chaqiramiz

import "./LEOSatelliteCalculator.css";
// CSS faylni ulaymiz – tashqi ko‘rinishni belgilash uchun

// Komponentni yaratamiz – bu funksiya `LEOSatelliteCalculator` deb nomlanadi
const LEOSatelliteCalculator: React.FC = () => {
    // useState yordamida foydalanuvchi kiritadigan parametrlar va natijani saqlaymiz:
    const [area, setArea] = useState(448978); // O‘zbekistonning umumiy maydoni, km²
    const [radius, setRadius] = useState(1000); // Har bir yo‘ldosh qamrovi radiusi, km
    const [efficiency, setEfficiency] = useState(0.6); // Qamrov samaradorligi (η)
    const [result, setResult] = useState<number | null>(null); // Hisoblangan yo‘ldoshlar soni

    // Hisoblash funksiyasi – tugma bosilganda ishga tushadi
    const calculateSatellites = () => {
        // Har bir yo‘ldosh tomonidan qamrab olinadigan samarali maydonni hisoblaymiz
        const coveragePerSatellite = Math.PI * Math.pow(radius, 2) * efficiency;

        // Umumiy maydonni bitta yo‘ldosh qamrovi samaradorligiga bo‘lamiz
        const n = area / coveragePerSatellite;

        // Natijani saqlaymiz
        setResult(n);
    };

    // Komponentning render qismi – foydalanuvchiga ko‘rinadigan HTML struktura
    return (
        <div className="leo-container">
            <h2>LEO Sun’iy Yo‘ldoshlar Hisoblagichi</h2>

            <div className="leo-inputs">
                {/* Maydon uchun input */}
                <label>
                    🇺🇿 Qamrab olinadigan maydon (S), km²:
                    <input
                        type="number"
                        value={area}
                        onChange={(e) => setArea(Number(e.target.value))}
                    />
                </label>

                {/* Yo‘ldosh radiusi uchun input */}
                <label>
                    🛰 Yo‘ldosh qamrovi radiusi (R), km:
                    <input
                        type="number"
                        value={radius}
                        onChange={(e) => setRadius(Number(e.target.value))}
                    />
                </label>

                {/* Qamrov samaradorligi uchun input */}
                <label>
                    📶 Qamrov samaradorligi (η):
                    <input
                        type="number"
                        step="0.01"
                        value={efficiency}
                        onChange={(e) => setEfficiency(Number(e.target.value))}
                    />
                </label>

                {/* Hisoblash tugmasi */}
                <button onClick={calculateSatellites}>Hisoblash</button>
            </div>

            {/* Agar hisoblangan natija mavjud bo‘lsa, u ko‘rsatiladi */}
            {result !== null && (
                <div className="leo-result">
                    <p>
                        📊 Teoretik yo‘ldoshlar soni: <strong>{result.toFixed(2)}</strong>
                    </p>
                    <p>
                        ✅ Amaliy jihatdan tavsiya etiladigan soni:{" "}
                        <strong>{Math.ceil(result * 10)}</strong>
                        {/* Amaliy tavsiya – taxminan 10 barobarga ko‘paytirilgan qiymat */}
                    </p>
                </div>
            )}
        </div>
    );
};

// Komponentni eksport qilamiz – boshqa joyda ishlatish uchun
export default LEOSatelliteCalculator;
