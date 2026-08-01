import { useState } from "react";
import PropTypes from "prop-types";
import { toast } from "sonner";
import { createReviewSchema } from "@ecomm/shared";
import { useCreateReviewMutation } from "../../api/reviewsApi";
import Button from "../ui/Button";
import Field from "../ui/Field";

function ReviewForm({ productId }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [fieldError, setFieldError] = useState("");
  const [createReview, { isLoading }] = useCreateReviewMutation();

  async function handleSubmit(event) {
    event.preventDefault();
    setFieldError("");

    // The same zod schema the API validates with, run here first for
    // immediate feedback before the round-trip.
    const result = createReviewSchema.safeParse({ rating: Number(rating), comment });
    if (!result.success) {
      setFieldError(result.error.issues[0]?.message ?? "Invalid review.");
      return;
    }

    try {
      await createReview({ productId, ...result.data }).unwrap();
      toast.success("Thanks for your review!");
      setComment("");
    } catch (error) {
      toast.error(error?.data?.message ?? "Could not submit your review.");
    }
  }

  return (
    <form className="review-form" onSubmit={handleSubmit}>
      <Field label="Your rating" error={fieldError}>
        {(id) => (
          <select
            id={id}
            className="ui-select"
            value={rating}
            onChange={(event) => setRating(event.target.value)}
          >
            {[5, 4, 3, 2, 1].map((value) => (
              <option key={value} value={value}>
                {value} star{value === 1 ? "" : "s"}
              </option>
            ))}
          </select>
        )}
      </Field>
      <Field label="Your review">
        {(id) => (
          <textarea
            id={id}
            className="ui-textarea"
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            placeholder="What did you think of this product?"
            required
          />
        )}
      </Field>
      <Button type="submit" isLoading={isLoading}>
        Submit review
      </Button>
    </form>
  );
}

ReviewForm.propTypes = {
  productId: PropTypes.number.isRequired,
};

export default ReviewForm;
