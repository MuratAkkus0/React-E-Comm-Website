import { CiCirclePlus } from "react-icons/ci";
import { CiCircleMinus } from "react-icons/ci";
import PropTypes from "prop-types";
import "../assets/css/components/itemAmountBtn.css";

function ItemAmountBtn({ styles = null, count, setCount }) {
  return (
    <div className="item__amount--container flex-row-centered">
      <CiCircleMinus
        style={styles && { fontSize: styles.iconSize }}
        onClick={() => {
          if (count > 0) {
            setCount(count - 1);
          }
        }}
        className="item__amount--icons"
      />
      <span
        style={styles && { fontSize: styles.fontSize }}
        className="item__amount--amount "
      >
        {count}
      </span>
      <CiCirclePlus
        style={styles && { fontSize: styles.iconSize }}
        onClick={() => setCount(count + 1)}
        className="item__amount--icons"
      />
    </div>
  );
}

ItemAmountBtn.propTypes = {
  styles: PropTypes.shape({
    iconSize: PropTypes.string,
    fontSize: PropTypes.string,
  }),
  count: PropTypes.number.isRequired,
  setCount: PropTypes.func.isRequired,
};

export default ItemAmountBtn;
