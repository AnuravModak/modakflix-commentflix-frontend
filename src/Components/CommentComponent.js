import React, { useState, useEffect, useMemo } from "react";
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
} from "semantic-ui-react";
import ReplyComponent from "./ReplyComponent";
import AddReply from "./AddReply";
import { fetchRepliesByCommentId } from "../Services/api";

const CommentComponent = ({ id, postId, author, createdtime, text }) => {
  const [isReplyVisible, setIsReplyVisible] = useState(false);
  const [replies, setReplies] = useState([]);
  const [displayedReplies, setDisplayedReplies] = useState(5); // Initially show 5 replies
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // const formattedTime = useMemo(()=>moment(time).format("DD/MM/YYYY, hh:mm A"));

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
    fetchReplies(); // Refresh replies dynamically after a new one is posted
  };

  const handleShowMore = () => {
    setDisplayedReplies((prev) => Math.min(prev + 4, replies.length)); // Show 4 more replies
  };

  const handleShowLess = () => {
    setDisplayedReplies((prev) => Math.max(prev - 4, 5)); // Show 4 fewer replies, minimum 5
  };

  const handleShowAll = () => {
    setDisplayedReplies(replies.length); // Show all replies
  };

  return (
    <CommentGroup>
      <Comment style={{ marginTop: "25px" }}>
        <CommentAvatar src="https://react.semantic-ui.com/images/avatar/small/elliot.jpg" />
        <CommentContent>
          <CommentAuthor as="a">{author}</CommentAuthor>
          <CommentMetadata>
            <div>{createdtime}</div>
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
          </CommentActions>
        </CommentContent>

        {/* Render replies with pagination */}
        {replies.slice(0, displayedReplies).map((reply) => (
          <ReplyComponent
            key={reply._id}
            id={reply._id}
            userId={reply.userId}
            postId={postId}
            createdtime={moment(reply.createdAt).format("DD/MM/YYYY, hh:mm A")}
            content={reply.content}
            commentId={id}
            onReplyPosted={handleReplyPosted}
          />
        ))}

        {/* Buttons for Show More, Show Less, Show All */}
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

        {/* Conditionally render AddReply */}
        {isReplyVisible && (
          <AddReply
            userId={author}
            postId={postId}
            commentId={id}
            onReplyPosted={handleReplyPosted}
          />
        )}
      </Comment>
    </CommentGroup>
  );
};

export default CommentComponent;
