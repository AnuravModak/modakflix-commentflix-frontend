import React, { useState, useEffect } from "react";
import { Loader, Message, Header, Button } from "semantic-ui-react";
import CommentComponent from "./CommentComponent";
import AddComment from "./AddComment";
import moment from "moment";
import { fetchCommentByPostId } from "../Services/api";

const CommentSection = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleCount, setVisibleCount] = useState(7);
  const [pinnedCommentId, setPinnedCommentId] = useState(null);

  const fetchComments = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetchCommentByPostId(postId);

      if (response.status !== 200 && response.status !== 201) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = response.data.map((comment) => ({
        ...comment,
        formattedTime: moment(comment.createdAt).format("DD MMM YYYY, hh:mm A"),
      }));

      setComments(data);

      // Automatically set the pinned comment if any
      const pinned = data.find((comment) => comment.isPinned);
      setPinnedCommentId(pinned ? pinned.id : null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const handleCommentPosted = () => {
    fetchComments();
  };

  const handleLoadMore = () => {
    setVisibleCount((prevCount) => prevCount + 7);
  };

  const handleGoBackToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePinComment = (commentId) => {
    setComments((prevComments) =>
      prevComments.map((comment) => ({
        ...comment,
        isPinned: comment.id === commentId ? !comment.isPinned : false,
      }))
    );
    setPinnedCommentId(commentId === pinnedCommentId ? null : commentId);
  };

  const pinnedComment = comments.find((comment) => comment.id === pinnedCommentId);
  const otherComments = comments.filter((comment) => comment.id !== pinnedCommentId);

  return (
    <div>
      <Header as="h2" dividing>
        Comments
      </Header>

      {loading && <Loader active inline="centered">Loading comments...</Loader>}

      {error && <Message error content={`Failed to load comments: ${error}`} />}

      {!loading && !error && comments.length === 0 && (
        <Message info content="No comments available for this post." />
      )}

      {!loading && !error && (
        <AddComment postId={postId} onCommentPosted={handleCommentPosted} />
      )}

      {!loading && !error && comments.length > 0 && (
        <>
          <Header as="h3" dividing>
            Previous Comments
          </Header>
          {pinnedComment && (
            <CommentComponent
              key={pinnedComment.id}
              id={pinnedComment.id}
              postId={postId}
              author={pinnedComment.userId}
              createdtime={pinnedComment.formattedTime}
              text={pinnedComment.content}
              isPinned={true}
              onPinComment={handlePinComment}
            />
          )}
          {otherComments.slice(0, visibleCount).map((comment) => (
            <CommentComponent
              key={comment.id}
              id={comment.id}
              postId={postId}
              author={comment.userId}
              createdtime={comment.formattedTime}
              text={comment.content}
              isPinned={comment.isPinned}
              onPinComment={handlePinComment}
            />
          ))}

          {visibleCount < otherComments.length && (
            <Button
              onClick={handleLoadMore}
              primary
              style={{ marginTop: "20px", marginRight: "10px" }}
            >
              Load More
            </Button>
          )}

          {visibleCount > 10 && (
            <Button
              onClick={handleGoBackToTop}
              secondary
              style={{ marginTop: "20px" }}
            >
              Go Back to Top
            </Button>
          )}
        </>
      )}
    </div>
  );
};

export default CommentSection;