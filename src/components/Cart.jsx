import { useContext } from "react";

import Modal from "./UI/Modal.jsx";
import Button from "./UI/Button.jsx";

import { currencyFormatter } from "../util/formatting.js";
import CartContext from "../store/cartContext.jsx";
import UserProgressContext from "../store/UserProgressContext.jsx";
import CartItem from "./CartItem.jsx";

export default function Cart() {
  const cartCtx = useContext(CartContext);
  const UserProgessCtx = useContext(UserProgressContext);

  const cartTotal = cartCtx.items.reduce(
    (totalPrice, item) => totalPrice + item.quantity * item.price,
    0
  );

  function handleCloseCart() {
    UserProgessCtx.hideCart();
  }

  return (
    <Modal className="cart" open={UserProgessCtx.progress === "cart"}>
      <h2>Your Cart</h2>
      <ul>
        {cartCtx.items.map((item) => (
          //   <li key={item.id}>
          //     {item.name} - {item.quantity}
          //   </li>
          <CartItem
            key={item.id}
            {...item}
            onIncrease={() => cartCtx.addItem(item)}
            onDecrease={() => cartCtx.removeItem(item.id)}
          />
        ))}
      </ul>
      <p className="cart-total">{currencyFormatter.format(cartTotal)}</p>
      <p className="modal-actions">
        <Button textOnly onClick={handleCloseCart}>
          닫기
        </Button>
        <Button onClick={handleCloseCart}>결제하기</Button>
      </p>
    </Modal>
  );
}
