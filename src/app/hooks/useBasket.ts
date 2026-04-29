import { useState } from 'react';

export type CartItem = {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
};

const useBasket = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const onAdd = (product: CartItem) => {
    const exist = cartItems.find((x) => x._id === product._id);
    if (exist) {
      setCartItems(
        cartItems.map((x) =>
          x._id === product._id ? { ...x, quantity: x.quantity + 1 } : x
        )
      );
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
  };

  const onRemove = (product: CartItem) => {
    const exist = cartItems.find((x) => x._id === product._id);
    if (exist?.quantity === 1) {
      setCartItems(cartItems.filter((x) => x._id !== product._id));
    } else {
      setCartItems(
        cartItems.map((x) =>
          x._id === product._id ? { ...x, quantity: x.quantity - 1 } : x
        )
      );
    }
  };

  const onDelete = (product: CartItem) => {
    setCartItems(cartItems.filter((x) => x._id !== product._id));
  };

  const onDeleteAll = () => {
    setCartItems([]);
  };

  return { cartItems, onAdd, onRemove, onDelete, onDeleteAll };
};

export default useBasket;
