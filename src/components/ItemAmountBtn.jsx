import { CiCirclePlus } from "react-icons/ci";
import { CiCircleMinus } from "react-icons/ci";
import "../assets/css/components/itemAmountBtn.css";

function ItemAmountBtn({ count, setCount }) {
  return (
    <div className="item__amount--container flex-row-centered">
      <CiCircleMinus
        onClick={() => {
          if (count > 0) {
            setCount(count - 1);
          }
        }}
        className="item__amount--icons"
      />
      <span className="item__amount--amount ">{count}</span>
      <CiCirclePlus
        onClick={() => setCount(count + 1)}
        className="item__amount--icons"
      />
    </div>
  );
}

export default ItemAmountBtn;
