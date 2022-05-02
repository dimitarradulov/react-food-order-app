import { useContext, useState, Fragment } from 'react';

import useFetch from '../../hooks/use-fetch';
import classes from './Cart.module.css';
import CartContext from '../../store/cart-context';
import Modal from '../UI/Modal';
import CartItem from './CartItem';
import Checkout from './Checkout';

const Cart = (props) => {
  const [isCheckout, setIsCheckout] = useState(false);
  const { errorOccured, isLoading, httpRequest, didSubmit } = useFetch();

  const cartCtx = useContext(CartContext);

  const totalAmount = `$${cartCtx.totalAmount.toFixed(2)}`;
  const hasItems = cartCtx.items.length > 0;

  const cartItemRemove = (id) => {
    cartCtx.removeItem(id);
  };

  const cartItemAdd = (item) => {
    cartCtx.addItem({ ...item, amount: 1 });
  };

  const onOrderHandler = () => {
    setIsCheckout(true);
  };

  const submitOrderHandler = (userData) => {
    httpRequest(
      {
        url: 'https://custom-hooks-9ea7a-default-rtdb.europe-west1.firebasedatabase.app/orders.json',
        method: 'POST',
        body: {
          user: userData,
          orderedItems: cartCtx.items,
        },
      },
      cartCtx.clearCart
    );
  };

  const cartItems = (
    <ul className={classes['cart-items']}>
      {cartCtx.items.map((item) => (
        <CartItem
          key={item.id}
          name={item.name}
          amount={item.amount}
          price={item.price}
          onRemove={cartItemRemove.bind(null, item.id)}
          onAdd={cartItemAdd.bind(null, item)}
        />
      ))}
    </ul>
  );

  const modalActions = (
    <div className={classes.actions}>
      <button onClick={props.onHideCart} className={classes['button--alt']}>
        Close
      </button>
      {hasItems && (
        <button onClick={onOrderHandler} className={classes.button}>
          Order
        </button>
      )}
    </div>
  );

  const initialModalContent = (
    <Fragment>
      {cartItems}
      <div className={classes.total}>
        <span>Total Amount</span>
        <span>{totalAmount}</span>
      </div>
      {isCheckout && (
        <Checkout onConfirm={submitOrderHandler} onCancel={props.onHideCart} />
      )}
      {!isCheckout && modalActions}
    </Fragment>
  );

  const isLoadingContent = <p>Please wait while we process your order...</p>;

  const errorContent = (
    <Fragment>
      <p style={{ color: 'red' }}>Error: {errorOccured}</p>
      <div className={classes.actions}>
        <button onClick={props.onHideCart} className={classes.button}>
          Close
        </button>
      </div>
    </Fragment>
  );

  const didSubmitContent = (
    <Fragment>
      <p>Your order has been received successfully!</p>
      <div className={classes.actions}>
        <button onClick={props.onHideCart} className={classes.button}>
          Close
        </button>
      </div>
    </Fragment>
  );

  return (
    <Modal onHideCart={props.onHideCart}>
      {!isLoading && !errorOccured && !didSubmit && initialModalContent}
      {isLoading && isLoadingContent}
      {errorOccured && errorContent}
      {didSubmit && !errorOccured && didSubmitContent}
    </Modal>
  );
};

export default Cart;
