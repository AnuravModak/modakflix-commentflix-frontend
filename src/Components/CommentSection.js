import React, { useState, useEffect } from 'react';
import { Loader, Message, Header, Button } from 'semantic-ui-react';
import CommentComponent from './CommentComponent';
import AddComment from './AddComment';
import { fetchCommentByPostId } from '../Services/api';

const CommentSection = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleCount, setVisibleCount] = useState(7); // Tracks how many comments to show

  // Fetch comments from the API
  const fetchComments = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetchCommentByPostId(postId);

      if (response.status !== 200 && response.status!==201) { // Check for successful status
        throw new Error(`Error: ${response.statusText}`);
      }
      
      let data = response.data; // Use response.data instead of response.json()

      // Sort comments by createdAt in descending order
      data = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setComments(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch comments when the component mounts or postId changes
  useEffect(() => {
    fetchComments();
  }, [postId]);

  const handleCommentPosted = () => {
    fetchComments();
  };

  const handleLoadMore = () => {
    setVisibleCount((prevCount) => prevCount + 7); // Increase visible count by 7
  };

  const handleGoBackToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll smoothly to the top of the page
  };

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

      {!loading && !error && comments.length === 0 && (
        <Header as="h4" dividing>
          No Comments Yet...
        </Header>
      )}

      {!loading && !error && comments.length > 0 && (
        <>
          <Header as="h3" dividing>
            Previous Comments
          </Header>
          {comments.slice(0, visibleCount).map((comment) => (
            <CommentComponent
              id={comment.id}
              postId={postId}
              author={comment.userId}
              time={new Date(comment.createdAt)}
              text={comment.content}
              replies={comment.replies}
            />
          ))}

          {visibleCount < comments.length && (
            <Button
              onClick={handleLoadMore}
              primary
              style={{ marginTop: '20px', marginRight: '10px' }}
            >
              Load More
            </Button>
          )}

          {visibleCount > 10 && (
            <Button
              onClick={handleGoBackToTop}
              secondary
              style={{ marginTop: '20px' }}
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
