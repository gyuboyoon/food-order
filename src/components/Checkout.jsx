import { useContext } from "react";

import Modal from "./UI/Modal.jsx";
import CartContext from "../store/cartContext.jsx";
import UserProgressContext from "../store/UserProgressContext.jsx";

import { currencyFormatter } from "../util/formatting.js";
import Input from "./UI/Input.jsx";
import Button from "./UI/Button.jsx";
import useHttp from "../hooks/useHttp.js";
import Error from "./Error.jsx";

export default function Checkout() {
  const cartCtx = useContext(CartContext);
  const userProgressCtx = useContext(UserProgressContext);

  const requestConfig = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  };

  const {
    data,
    isLoading: isSending,
    error,
    sendRequest,
    clearData,
  } = useHttp("http://localhost:3000/orders", requestConfig);

  const cartTotal = cartCtx.items.reduce(
    (totalPrice, item) => totalPrice + item.quantity * item.price,
    0
  );

  function handleClose() {
    userProgressCtx.hideCheckout();
  }

  function handleFinist() {
    userProgressCtx.hideCheckout();
    cartCtx.clearCart();
    clearData();
  }

  function handleSubmit(event) {
    event.preventDefault();

    const fd = new FormData(event.target);
    const customerData = Object.fromEntries(fd.entries());

    sendRequest(
      JSON.stringify({
        order: {
          items: cartCtx.items,
          customer: customerData,
        },
      })
    );

    // fetch("http://localhost:3000/orders", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     order: {
    //       items: cartCtx.items,
    //       customer: customerData,
    //     },
    //   }),
    // });
  }

  let actions = (
    <>
      <Button type="button" textOnly onClick={handleClose}>
        닫기
      </Button>
      <Button>주문제출</Button>
    </>
  );

  if (isSending) {
    actions = <span>주문 내역을 보내는 중입니다.</span>;
  }

  if (data && !error) {
    return (
      <Modal
        open={userProgressCtx.progress === "checkout"}
        onClose={handleFinist}
      >
        <h2>주문을 완료했습니다!</h2>
        <p>주문을 성공했습니다.</p>
        <p>자세한 내용은 이메일로 몇분 이내에 확인할 수 있습니다.</p>
        <p className="modal-actions">
          <Button onClick={handleFinist}>완료</Button>
        </p>
      </Modal>
    );
  }

  return (
    <Modal open={userProgressCtx.progress === "checkout"} onClose={handleClose}>
      <form onSubmit={handleSubmit}>
        <h2>결제하기</h2>
        <p>총 금액: {currencyFormatter.format(cartTotal)}</p>

        <Input label="이름" type="text" id="name" />
        <Input label="이메일" type="email" id="email" />
        <Input label="거리" type="text" id="street" />
        <div className="control-row">
          <Input label="우편번호" type="text" id="postal-code" />
          <Input label="도시" type="text" id="city" />
        </div>

        {error && <Error title="주문을 실패했습니다." message={error} />}
        <p className="modal-actions">{actions}</p>
      </form>
    </Modal>
  );
}
