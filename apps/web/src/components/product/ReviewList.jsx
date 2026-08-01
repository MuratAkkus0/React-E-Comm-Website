import PropTypes from "prop-types";
import { useGetReviewsQuery } from "../../api/reviewsApi";
import Skeleton from "../ui/Skeleton";
import EmptyState from "../ui/EmptyState";

function Stars({ rating }) {
  return (
    <span aria-label={`${rating} out of 5 stars`} className="review__stars">
      {"★".repeat(rating)}
      {"☆".repeat(5 - rating)}
    </span>
  );
}

Stars.propTypes = { rating: PropTypes.number.isRequired };

function ReviewList({ productId }) {
  const { data, isLoading } = useGetReviewsQuery({ productId });

  if (isLoading) {
    return (
      <div className="review-list">
        <Skeleton height="4rem" />
      </div>
    );
  }

  if (!data || data.items.length === 0) {
    return <EmptyState title="No reviews yet" description="Be the first to review this product." />;
  }

  return (
    <ul className="review-list">
      {data.items.map((review) => (
        <li key={review.id} className="review-list__item">
          <div className="review-list__header">
            <Stars rating={review.rating} />
            <span className="review-list__author">{review.user.name}</span>
          </div>
          <p className="review-list__comment">{review.comment}</p>
        </li>
      ))}
    </ul>
  );
}

ReviewList.propTypes = {
  productId: PropTypes.number.isRequired,
};

export default ReviewList;
