"use client";

import { useState, useEffect } from "react";

interface CompareButtonProps {
  productId: string;
}

export function CompareButton({ productId }: CompareButtonProps) {
  const [isInBasket, setIsInBasket] = useState(false);

  // İlk yüklemede sepette olup olmadığını kontrol edelim
  useEffect(() => {
    const getBasket = () => {
      try {
        const basket = JSON.parse(localStorage.getItem("hirdavatpro_basket") || "[]");
        setIsInBasket(basket.includes(productId));
      } catch {
        setIsInBasket(false);
      }
    };

    getBasket();

    // Diğer bileşenlerden gelen güncellemeleri de dinleyelim
    const handleBasketChange = () => {
      getBasket();
    };

    window.addEventListener("hirdavatpro_basket_change", handleBasketChange);
    return () => {
      window.removeEventListener("hirdavatpro_basket_change", handleBasketChange);
    };
  }, [productId]);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const basket: string[] = JSON.parse(localStorage.getItem("hirdavatpro_basket") || "[]");

      if (isInBasket) {
        // Sepetten çıkar
        const newBasket = basket.filter((id) => id !== productId);
        localStorage.setItem("hirdavatpro_basket", JSON.stringify(newBasket));
        setIsInBasket(false);
      } else {
        // En fazla 3 ürün sınırı
        if (basket.length >= 3) {
          alert("Aynı anda en fazla 3 ürünü karşılaştırabilirsiniz!");
          return;
        }
        // Sepete ekle
        const newBasket = [...basket, productId];
        localStorage.setItem("hirdavatpro_basket", JSON.stringify(newBasket));
        setIsInBasket(true);
      }

      // Değişikliği tüm sayfaya duyurmak için custom event tetikleyelim
      window.dispatchEvent(new Event("hirdavatpro_basket_change"));
    } catch {
      console.error("Sepet güncellenirken bir hata oluştu.");
    }
  };

  return (
    <button
      onClick={handleToggle}
      className={`absolute top-4 right-4 p-2 rounded-full transition-all border shadow-sm flex items-center justify-center cursor-pointer active:scale-90 ${
        isInBasket
          ? "bg-primary text-white border-primary"
          : "bg-white/90 text-secondary border-border-subtle hover:bg-primary hover:text-white hover:border-primary"
      }`}
      title={isInBasket ? "Karşılaştırmadan Çıkar" : "Karşılaştırma Sepetine Ekle"}
    >
      <span
        className="material-symbols-outlined text-[20px]"
        style={{ fontVariationSettings: isInBasket ? "'FILL' 1" : "'FILL' 0" }}
      >
        compare_arrows
      </span>
    </button>
  );
}
