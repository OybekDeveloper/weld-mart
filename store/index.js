import Cookies from "js-cookie";
import { create } from "zustand";

export const useClientStore = create((set) => ({
  client: Cookies.get("client") ? JSON.parse(Cookies.get("client")) : null,
  setClient: (data) => set(() => ({ client: data })),
}));

export const useStore = create((set) => ({
  open: false,
  isDisabled: true,
  setIsDisabled: (data) => set(() => ({ isDisabled: data })),
  toggleOpen: () => set((state) => ({ open: !state.open })),
  favorites: [],
  setFavorites: (favorite) => set(() => ({ favorites: favorite })),
  activeTab: "delivery",
  setActiveTab: (tab) =>
    set(() => {
      localStorage.setItem("activeTab", tab);
      return { activeTab: tab };
    }),
  initializeFavorites: () => {
    const savedProducts = localStorage.getItem("isFavorites");

    const savedActiveTab = localStorage.getItem("activeTab");
    const parsedProducts = savedProducts ? JSON.parse(savedProducts) : [];
    set({ favorites: parsedProducts });
    set({ activeTab: savedActiveTab ? savedActiveTab : "delivery" });
  },
}));

export const useProductStore = create((set) => ({
  products: [],
  initializeProducts: () => {
    const savedProducts = localStorage.getItem("products");
    const parsedProducts = savedProducts ? JSON.parse(savedProducts) : [];
    set({ products: parsedProducts });
  },
  setProductsData: (data) =>
    set(() => {
      localStorage.setItem("products", JSON.stringify(data));
      return {
        products: data,
      };
    }),
  setProducts: (data) =>
    set((state) => {
      state.initializeProducts();
      let updatedProducts = state.products.some((p) => p.id === data.id)
        ? state.products.map((p) =>
            p.id === data.id ? { ...p, count: p.count + 1 } : p
          )
        : [...state.products, { ...data, count: 1 }];
      localStorage.setItem("products", JSON.stringify(updatedProducts));
      return { products: updatedProducts };
    }),
  incrementCount: (product_id) =>
    set((state) => {
      if (product_id) {
        let updatedProducts = state.products.map((product) =>
          product.id === product_id
            ? { ...product, count: product.count + 1 }
            : product
        );
        localStorage.setItem("products", JSON.stringify(updatedProducts));
        return { products: updatedProducts };
      }
    }),
  decrementCount: (product_id) =>
    set((state) => {
      if (product_id) {
        let updatedProducts = state.products
          .map((product) =>
            product?.id === product_id && product.count > 0
              ? { ...product, count: product.count - 1 }
              : product
          )
          .filter((product) => product?.count > 0);

        localStorage.setItem("products", JSON.stringify(updatedProducts));
        return { products: updatedProducts };
      }
    }),
  resetProduct: () =>
    set(() => {
      localStorage.setItem("products", JSON.stringify([]));
      return { products: [] };
    }),
  deleteProduct: (product_id) =>
    set((state) => {
      let updatedProducts = state.products.filter(
        (product) => product?.id !== product_id
      );
      localStorage.setItem("products", JSON.stringify(updatedProducts));
      return { products: updatedProducts };
    }),
}));

export const useOrderStore = create((set) => ({
  orderData: {
    spot_id: 0,
    spot_name: "",
    phone: "",
    products: [],
    payment_method: "",
    total: 0,
    delivery_price: 0,
    lng: 0,
    lat: 0,
    client: null,
    pay_cash: null,
    pay_card: null,
    pay_click: null,
    pay_payme: null,
    pay_uzum: null,
    pay_bonus: null,
    comment: "",
    address: "",
    client_addresses_id: null,
  },
  totalSum: 0,
  paymentData: null,
  selectCard: null,
  setSelectCard: (data) => {
    set((state) => {
      localStorage.setItem("selectCard", JSON.stringify(data));
      return { selectCard: data };
    });
  },
  setPaymentData: (data) => {
    set((state) => {
      localStorage.setItem("paymentData", JSON.stringify(data));
      Cookies.set("paymentData", JSON.stringify(data), { expires: 1 });
      return { paymentData: data };
    });
  },
  setTotalSum: (data) =>
    set(() => {
      localStorage.setItem("totalSum", JSON.stringify(data));
      return { totalSum: data };
    }),
  setOrderData: (data) =>
    set(() => {
      localStorage.setItem("orderData", JSON.stringify(data));
      return { orderData: data };
    }),

  initializeOrderData: () => {
    const orderData = localStorage.getItem("orderData");
    const totalSum = localStorage.getItem("totalSum");
    const paymentData = localStorage.getItem("paymentData");
    const selectCard = localStorage.getItem("selectCard");
    const parsedOrderData = orderData
      ? JSON.parse(orderData)
      : {
          spot_id: 0,
          spot_name: "",
          phone: "",
          products: [],
          payment_method: "",
          total: 0,
          delivery_price: 0,
          lng: 0,
          lat: 0,
          client: null,
          pay_cash: null,
          pay_card: null,
          pay_click: null,
          pay_payme: null,
          pay_uzum: null,
          pay_bonus: null,
          comment: "",
          address: "",
          client_addresses_id: null,
        };
    set({ orderData: { ...parsedOrderData, delivery_price: 0 } });
    set({ totalSum: totalSum || 0 });
    set({ paymentData: paymentData ? JSON.parse(paymentData) : null });
    set({ selectCard: selectCard ? JSON.parse(selectCard) : null });
  },
  resetOrder: () => {
    set({
      orderData: {
        spot_id: 0,
        spot_name: "",
        phone: "",
        products: [],
        payment_method: "",
        total: 0,
        delivery_price: 0,
        lng: 0,
        lat: 0,
        client: null,
        pay_cash: null,
        pay_card: null,
        pay_click: null,
        pay_payme: null,
        pay_uzum: null,
        pay_bonus: null,
        comment: "",
        address: "",
        client_addresses_id: null,
      },
    });
  },
}));
