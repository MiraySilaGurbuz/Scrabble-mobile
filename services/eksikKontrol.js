
import kelimeListesiRaw from "../assets/kelimeListesi_from_txt.json";


const normalizeKeys = (obj) => {
  const result = {};
  for (const key in obj) {
    const normalizedKey = key.normalize("NFD").replace(/[\u0307]/g, "").normalize("NFC");
    result[normalizedKey] = obj[key];
  }
  return result;
};


const kelimeListesi = normalizeKeys(kelimeListesiRaw);


export const eksikKelimeleriBul = (kelimeler) => {
  const eksikKelimeler = [];

  kelimeler.forEach(kelime => {
    const kucukKelime = kelime.normalize("NFC").toLocaleLowerCase("tr").trim();
    const ilkHarf = kucukKelime[0].normalize("NFD").replace(/[\u0307]/g, "").normalize("NFC");

    const mevcutListe = kelimeListesi[ilkHarf];

    
    console.log("kelime:", kelime);
    console.log("kucukKelime:", kucukKelime);
    console.log("ilkHarf:", ilkHarf);
    console.log("mevcutListe var mı?", mevcutListe ? "evet" : "HAYIR ❌");

    if (!mevcutListe || !mevcutListe.includes(kucukKelime)) {
      eksikKelimeler.push(kelime);
    }
  });

  return eksikKelimeler;
};
