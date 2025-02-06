import { useContext } from "react";

import Modal from "./UI/Modal.jsx";
import CartContext from "../store/cartContext.jsx";
import UserProgressContext from "../store/UserProgressContext.jsx";

import { currencyFormatter } from "../util/formatting.js";
import Input from "./UI/Input.jsx";
import Button from "./UI/Button.jsx";

export default function Checkout() {
  const cartCtx = useContext(CartContext);
  const userProgressCtx = useContext(UserProgressContext);

  const cartTotal = cartCtx.items.reduce(
    (totalPrice, item) => totalPrice + item.quantity * item.price,
    0
  );

  function handleClose() {
    userProgressCtx.hideCheckout();
  }

  return (
    <Modal open={userProgressCtx.progress === "checkout"} onClose={handleClose}>
      <form action="">
        <h2>결제하기</h2>
        <p>총 금액: {currencyFormatter.format(cartTotal)}</p>

        <Input label="이름" type="text" id="이름전체" />
        <Input label="이메일" type="email" id="메일주소" />
        <Input label="거리" type="text" id="거리이름" />
        <div className="control-row">
          <Input label="우편번호" type="text" id="우편-번호" />
          <Input label="도시" type="text" id="도시이름" />
        </div>

        <p className="modal-actions">
          <Button type="button" textOnly onClick={handleClose}>
            닫기
          </Button>
          <Button>주문제출</Button>
        </p>
      </form>
    </Modal>
  );
}
