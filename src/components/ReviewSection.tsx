"use client";

import { useEffect, useState } from "react";

interface Review {
  _id: string;
  authorName: string;
  rating: number;
  title: string;
  content: string;
  createdAt: string;
}

interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution?: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

interface ReviewSectionProps {
  productId: string;
}

export default function ReviewSection({ productId }: ReviewSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats>({
    averageRating: 0,
    totalReviews: 0,
  });
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 10;
  const [newReview, setNewReview] = useState({
    authorName: "",
    email: "",
    rating: 5,
    title: "",
    content: "",
  });

  // Fetch reviews on component mount and when productId changes
  useEffect(() => {
    if (!productId) return;
    fetchReviews();
  }, [productId, currentPage]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `/api/reviews/${encodeURIComponent(
          productId
        )}?page=${currentPage}&limit=${reviewsPerPage}`
      );
      const data = await res.json();

      if (res.ok && data.success) {
        setReviews(data.data || []);
        setStats(data.stats || { averageRating: 0, totalReviews: 0 });
      } else {
        console.error("Failed to fetch reviews:", data.error);
        setReviews([]);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(null);

    // Validation
    if (!newReview.authorName.trim()) {
      setSubmitError("Please enter your name");
      return;
    }
    if (!newReview.email.trim()) {
      setSubmitError("Please enter your email");
      return;
    }
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(newReview.email)) {
      setSubmitError("Please enter a valid email");
      return;
    }
    if (!newReview.title.trim()) {
      setSubmitError("Please enter a review title");
      return;
    }
    if (!newReview.content.trim() || newReview.content.trim().length < 2) {
      setSubmitError("Review must be at least 2 characters");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/reviews/${encodeURIComponent(productId)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newReview),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSubmitSuccess(
          "Review submitted successfully! It will be published after moderation."
        );
        setNewReview({
          authorName: "",
          email: "",
          rating: 5,
          title: "",
          content: "",
        });
        setShowReviewForm(false);

        // Refresh reviews after a short delay
        setTimeout(() => {
          fetchReviews();
        }, 1500);
      } else {
        setSubmitError(data.error || "Failed to submit review");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      setSubmitError("Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-12 max-w-4xl mx-auto bg-zinc-900 px-2 py-5">
      <h2 className="font-montserrat text-white/90 tracking-tight leading-tight font-normal text-[44px] max-sm:text-[28px] max-md:text-[35px]">
        Customer Reviews
      </h2>

      {/* Average Rating */}
      <div className="mb-8 p-6 rounded-lg bg-zinc-600 ">
        <div className="flex items-center gap-4">
          <div className="text-4xl font-bold">
            {stats.averageRating.toFixed(1)}
          </div>
          <div>
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className={
                    i < Math.round(stats.averageRating)
                      ? "text-yellow-400 text-xl"
                      : "text-gray-300 text-xl"
                  }
                >
                  ★
                </span>
              ))}
            </div>
            <p className="text-gray-400">{stats.totalReviews} reviews</p>
          </div>
        </div>
      </div>

      {/* Add Review Button */}
      <div className="mb-8 flex gap-3">
        <button
          onClick={() => setShowReviewForm(!showReviewForm)}
          className="px-6 py-2 bg-[#C9B27B] text-black font-semibold rounded hover:bg-[#b5a265] transition"
        >
          {showReviewForm ? "Cancel" : "Write a Review"}
        </button>
      </div>

      {/* Review Form */}
      {showReviewForm && (
        <form onSubmit={handleSubmitReview}>
          <div className="mb-8 p-6 bg-zinc-700 rounded-lg border-2 border-[#C9B27B]">
            <h3 className="text-lg font-semibold mb-4">Share Your Review</h3>

            {/* Error Message */}
            {submitError && (
              <div className="mb-4 p-3 bg-red-900 text-red-200 rounded">
                {submitError}
              </div>
            )}

            {/* Success Message */}
            {submitSuccess && (
              <div className="mb-4 p-3 bg-green-900 text-green-200 rounded">
                {submitSuccess}
              </div>
            )}

            <input
              type="text"
              placeholder="Your Name"
              value={newReview.authorName}
              onChange={(e) =>
                setNewReview({ ...newReview, authorName: e.target.value })
              }
              className="w-full mb-4 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#C9B27B]"
              required
            />
            <input
              type="email"
              placeholder="Your Email"
              value={newReview.email}
              onChange={(e) =>
                setNewReview({ ...newReview, email: e.target.value })
              }
              className="w-full mb-4 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#C9B27B]"
              required
            />
            <input
              type="text"
              placeholder="Review Title"
              value={newReview.title}
              onChange={(e) =>
                setNewReview({ ...newReview, title: e.target.value })
              }
              className="w-full mb-4 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#C9B27B]"
              required
            />
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewReview({ ...newReview, rating: star })}
                    className={`text-3xl transition ${
                      star <= newReview.rating
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
            <textarea
              placeholder="Your Review (min. 20 characters)"
              value={newReview.content}
              onChange={(e) =>
                setNewReview({ ...newReview, content: e.target.value })
              }
              className="w-full mb-4 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#C9B27B] resize-none"
              rows={4}
              required
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-green-600 text-white font-semibold rounded hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        </form>
      )}
      {/* Reviews List */}
      <div className="space-y-6">
        {loading ? (
          <p className="text-gray-500 text-center py-8">Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No reviews yet. Be the first to review!
          </p>
        ) : (
          <>
            {reviews.map((review) => (
              <div
                key={review._id}
                className="p-4 bg-zinc-800 rounded-lg border border-zinc-700"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold">{review.title}</h4>
                    <p className="text-sm text-gray-400">{review.authorName}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex gap-1 justify-end mb-1">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={
                            i < review.rating
                              ? "text-yellow-400"
                              : "text-gray-500"
                          }
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <p className="text-gray-300">{review.content}</p>
              </div>
            ))}

            {/* Pagination */}
            {stats.totalReviews > reviewsPerPage && (
              <div className="flex justify-center gap-2 mt-6">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-zinc-700 text-white rounded hover:bg-zinc-600 disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-gray-400">
                  Page {currentPage}
                </span>
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={
                    currentPage >=
                    Math.ceil(stats.totalReviews / reviewsPerPage)
                  }
                  className="px-4 py-2 bg-zinc-700 text-white rounded hover:bg-zinc-600 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
