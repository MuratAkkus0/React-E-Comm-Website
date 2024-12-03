import { useDispatch, useSelector } from "react-redux";
import "../assets/css/components/basketDrawer.css";
import { CiCircleMinus, CiCirclePlus } from "react-icons/ci";
import { setCount, setTotalAmount } from "../redux/slices/basketSlice";
import { useEffect } from "react";

function BasketDrawer() {
  const { products, isBasketActive, totalAmount } = useSelector(
    (store) => store.basket
  );
  const currency = "€";
  const titleCharLimit = 26;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setTotalAmount());
  }, []);

  const reduceProductAmount = (count, index) => {
    dispatch(setCount({ count: count - 1, index }));
    dispatch(setTotalAmount());
  };
  const increaseProductAmount = (count, index) => {
    dispatch(setCount({ count: count + 1, index }));
    dispatch(setTotalAmount());
  };

  return (
    <>
      <div
        style={isBasketActive ? {} : { right: "-150%", overflow: "hidden" }}
        className="basket--container"
      >
        {products && products.length ? (
          <>
            {products.map((item, index) => (
              <div key={item.id} className="basket__product--container">
                <div className="basket__product--img--container flex-row-centered">
                  <img
                    src={item.image}
                    alt=""
                    className="basket__product--img"
                  />
                </div>
                <div className="basket__product--title">
                  {item.title.length > titleCharLimit
                    ? item.title.slice(0, titleCharLimit) + "..."
                    : item.title}
                </div>
                <div className="basket__product--controls">
                  <div className="basket__product--price">
                    {item.price}
                    {currency}
                  </div>
                  <div className="item__amount--container flex-row-centered">
                    <CiCircleMinus
                      onClick={() => {
                        if (item.count > 0) {
                          reduceProductAmount(item.count, index);
                        }
                      }}
                      className="item__amount--icons"
                    />
                    <span className="item__amount--amount ">{item.count}</span>
                    <CiCirclePlus
                      onClick={() => increaseProductAmount(item.count, index)}
                      className="item__amount--icons"
                    />
                  </div>
                </div>
              </div>
            ))}
            <span>{totalAmount}</span>{" "}
          </>
        ) : (
          <span className="basket--no-item">No Item :(</span>
        )}
      </div>
    </>
  );
}

export default BasketDrawer;
