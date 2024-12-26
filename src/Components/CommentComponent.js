import React, { useState, useEffect } from "react";
import moment from "moment";
import {
  Comment,
  CommentText,
  CommentMetadata,
  CommentGroup,
  CommentContent,
  CommentAvatar,
  CommentActions,
  Button,
  CommentAuthor,
  Icon,
} from "semantic-ui-react";
import ReplyComponent from "./ReplyComponent";
import AddReply from "./AddReply";
import { fetchRepliesByCommentId, updateIsPinned } from "../Services/api";

const CommentComponent = ({
  id,
  postId,
  author,
  createdtime,
  text,
  onPinComment,
  isPinned,
}) => {
  const [isReplyVisible, setIsReplyVisible] = useState(false);
  const [replies, setReplies] = useState([]);
  const [displayedReplies, setDisplayedReplies] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [localIsPinned, setLocalIsPinned] = useState(isPinned);
  const [isPinLoading, setIsPinLoading] = useState(false);

  // Synchronize local state with `isPinned` prop
  useEffect(() => {
    setLocalIsPinned(isPinned);
  }, [isPinned]);

  const toggleReplyVisibility = () => {
    setIsReplyVisible(!isReplyVisible);
  };

  const fetchReplies = async () => {
    try {
      setLoading(true);
      const response = await fetchRepliesByCommentId(id);
      if (response.status === 200 || response.status === 201) {
        setReplies(response.data);
      }
    } catch (err) {
      setError("Failed to load replies");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReplies();
  }, [id]);

  const handleReplyPosted = () => {
    fetchReplies();
  };

  const handleShowMore = () => {
    setDisplayedReplies((prev) => Math.min(prev + 4, replies.length));
  };

  const handleShowLess = () => {
    setDisplayedReplies((prev) => Math.max(prev - 4, 5));
  };

  const handleShowAll = () => {
    setDisplayedReplies(replies.length);
  };

  const handlePinClick = async () => {
    try {
      setIsPinLoading(true);
      const response = await updateIsPinned(id);
      if (response.status === 200 || response.status === 201) {
        setLocalIsPinned(!localIsPinned); // Toggle locally
        onPinComment(id); // Notify parent
      } else {
        throw new Error("Unexpected response from server");
      }
    } catch (err) {
      console.error("Failed to update pinned status:", err.message);
      setError("Failed to update the pinned status. Please try again.");
    } finally {
      setIsPinLoading(false);
    }
  };

  return (
    <CommentGroup>
      <Comment style={{ marginTop: "25px" }}>
        <CommentAvatar src="https://react.semantic-ui.com/images/avatar/small/elliot.jpg" />
        <CommentContent
          style={{
            backgroundColor: localIsPinned ? "rgba(234, 238, 182, 0.8)" : "transparent",
          }}
        >
          <CommentAuthor as="a">{author}</CommentAuthor>
          <CommentMetadata>
            <div>{moment(createdtime).format("DD/MM/YYYY, hh:mm A")}</div>
          </CommentMetadata>
          <CommentText>
            <p>{text}</p>
          </CommentText>
          <CommentActions>
            <Button
              style={{
                backgroundColor: "transparent",
                boxShadow: "none",
                color: "#4183c4",
                padding: "0",
              }}
              size="tiny"
              onClick={toggleReplyVisibility}
            >
              {isReplyVisible ? "Cancel" : "Reply"}
            </Button>
            <Button
              style={{
                backgroundColor: "transparent",
                boxShadow: "none",
                color: localIsPinned ? "green" : "#4183c4",
                padding: "0",
                marginLeft: "10px",
              }}
              size="tiny"
              onClick={handlePinClick}
              loading={isPinLoading}
              disabled={isPinLoading}
            >
              <Icon name="pin" />
              {localIsPinned ? "Unpin" : "Pin"}
            </Button>
          </CommentActions>
        </CommentContent>

        {error && <div style={{ color: "red", marginTop: "10px" }}>{error}</div>}

        {isReplyVisible && (
          <AddReply
            userId={author}
            postId={postId}
            commentId={id}
            onReplyPosted={handleReplyPosted}
          />
        )}

        {replies.slice(0, displayedReplies).map((reply) => (
          <ReplyComponent
            key={reply._id}
            id={reply._id}
            userId={reply.userId}
            postId={postId}
            createdtime={createdtime}
            content={reply.content}
            commentId={id}
            onReplyPosted={handleReplyPosted}
          />
        ))}

        {replies.length > 5 && (
          <div style={{ marginTop: "10px" }}>
            {displayedReplies < replies.length && (
              <Button size="small" onClick={handleShowMore}>
                Show More
              </Button>
            )}
            {displayedReplies > 5 && (
              <Button size="small" onClick={handleShowLess}>
                Show Less
              </Button>
            )}
            {displayedReplies !== replies.length && (
              <Button size="small" onClick={handleShowAll}>
                Show All
              </Button>
            )}
          </div>
        )}
      </Comment>
    </CommentGroup>
  );
};

export default CommentComponent;
