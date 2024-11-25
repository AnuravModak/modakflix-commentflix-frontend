// CommentSection.js
import React, { useState, useEffect } from 'react';
import { Loader, Message , Header} from 'semantic-ui-react';
import CommentComponent from './CommentComponent';

const CommentSection = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch comments from the API
  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`http://localhost:8080/api/comments/post/${postId}`);
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        setComments(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [postId]); // Re-fetch comments if the postId changes

  return (
    <div>
      <Header as='h3' dividing>
      Comments
    </Header>

      {loading && <Loader active inline="centered">Loading comments...</Loader>}

      {error && <Message error content={`Failed to load comments: ${error}`} />}

      {!loading && !error && comments.length === 0 && (
        <Message info content="No comments available for this post." />
      )}

      {!loading && !error && comments.map((comment) => (
        <CommentComponent
          id={comment.id}
          author={comment.userId}
          time={new Date(comment.createdAt)}
          text={comment.content}
          replies={comment.replies}
        />
      ))}
    </div>
  );
};

export default CommentSection;
