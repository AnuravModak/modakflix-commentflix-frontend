import React, { useState, useEffect } from 'react';
import moment from 'moment'; // Import moment.js for date formatting
import {
  Comment,
  CommentText,
  CommentMetadata,
  CommentGroup,
  CommentContent,
  CommentAvatar,
  CommentActions,
  Button, // Import Button from Semantic UI
  CommentAuthor,
} from 'semantic-ui-react'; // Import Semantic UI components
import ReplyComponent from './ReplyComponent';
import AddReply from './AddReply';
import { fetchRepliesByCommentId } from '../Services/api';

const CommentComponent = ({ id, postId, author, time, text }) => {
  const [isReplyVisible, setIsReplyVisible] = useState(false);
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Formatting the timestamp using moment.js
  const formattedTime = moment(time).format("DD/MM/YYYY, hh:mm A");

  // Toggle the visibility of the reply field
  const toggleReplyVisibility = () => {
    setIsReplyVisible(!isReplyVisible);
  };

  // Fetch replies for the comment
  const fetchReplies = async () => {
    try {
      setLoading(true);
      const response = await fetchRepliesByCommentId(id);
      if (response.status === 200 || response.status === 201) {
        const sortedReplies = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setReplies(sortedReplies);
      }
    } catch (err) {
      setError('Failed to load replies');
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch of replies
  useEffect(() => {
    fetchReplies();
  }, [id]);

  const handleReplyPosted = () => {
    fetchReplies(); // Refresh replies dynamically after a new one is posted
  };

  return (
    <CommentGroup>
      <Comment style={{ marginTop: '25px' }}>
        <CommentAvatar src="https://react.semantic-ui.com/images/avatar/small/elliot.jpg" />
        <CommentContent>
          <CommentAuthor as="a">{author}</CommentAuthor>
          <CommentMetadata>
            <div>{formattedTime}</div>
          </CommentMetadata>
          <CommentText>
            <p>{text}</p>
          </CommentText>
          <CommentActions>
            <Button
              style={{
                backgroundColor: 'transparent', // Transparent background
                boxShadow: 'none', // Remove any box shadow
                color: '#4183c4', // Optional: Match Semantic UI link color for text
                padding: '0', // Optional: Adjust padding for minimalistic look
              }}
              size="tiny"
              onClick={toggleReplyVisibility}
            >
              {isReplyVisible ? "Cancel" : "Reply"}
            </Button>
          </CommentActions>
        </CommentContent>

        {/* Nested replies */}
        {replies.length > 0 &&
          replies.map((reply) => (
            <ReplyComponent
              key={reply._id}
              id={reply._id}
              userId={reply.userId}
              postId={postId}
              time={reply.updatedTime}
              content={reply.content}
              commentId={id}
              onReplyPosted={handleReplyPosted}
            />
          ))}

        {/* Conditionally render AddReply */}
        {isReplyVisible && (
          <AddReply
            userId={author}
            postId={postId}
            commentId={id}
            onReplyPosted={handleReplyPosted} // Pass the callback to refresh replies
          />
        )}
      </Comment>
    </CommentGroup>
  );
};

export default CommentComponent;
