import React, { useState, useEffect } from 'react';
import { Loader, Message, Header, Form, Button, TextArea } from 'semantic-ui-react';
import CommentComponent from './CommentComponent';
import { fetchCommentByPostId, addComment} from '../Services/api';

const CommentSection = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchCommentByPostId(postId);
        setComments(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [postId]);

  const handlePostComment = async () => {
    try {
      const newCommentData = await addComment(postId, newComment);
      setComments((prevComments) => [newCommentData, ...prevComments]);
      setNewComment('');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <Header as="h3" dividing>
        Comments
      </Header>
      {loading && <Loader active inline="centered">Loading comments...</Loader>}
      {error && <Message error content={`Failed to load comments: ${error}`} />}
      {!loading && !error && comments.length === 0 && (
        <Message info content="No comments available for this post." />
      )}
      <Form>
        <Form.Field>
          <TextArea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
          />
        </Form.Field>
        <Button onClick={handlePostComment} primary>
          Post Comment
        </Button>
      </Form>
      {!loading &&
        !error &&
        comments.map((comment) => (
          <CommentComponent
            key={comment.id}
            id={comment.id}
            author={comment.userId}
            time={comment.createdAt}
            text={comment.content}
            replies={comment.replies}
          />
        ))}
    </div>
  );
};

export default CommentSection;
