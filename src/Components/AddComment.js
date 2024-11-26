import React, { useState } from "react";
import { CommentGroup, Form, Button, TextArea } from "semantic-ui-react";
import { addComment } from "../Services/api";

const AddComment = ({postId,onCommentPosted,userId="Anurav"}) => {
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading]=useState(false);
  const [error,setError]=useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const handleDelete = () => {
    setCommentText('');  // Clears the TextArea
  };

  const handleChange = (e) => {
    setCommentText(e.target.value);  // Updates the state with the new comment text
  };

  const handlePostComment = async()=>{
    if (!commentText.trim()){
        setError("Comment cannot be empty!");
        return;
    }

    setLoading(true);
    setError(null);

    try {
        // Calling the addComment API function
        const response = await addComment({ content: commentText, postId:postId , userId:userId});
  
        if (response.status === 200 || response.status==201) {
          // Reset the text area and show success message
          setCommentText('');
          setSuccessMessage("Comment posted successfully!");
          if (onCommentPosted) {
            onCommentPosted(); // Notify parent to refresh comments
          }
        } else {
          throw new Error("Failed to post comment!");
        }
      } catch (error) {
        setError(error.message); // If error occurs, show error message
      } finally {
        setLoading(false); // Stop loading after the API request is complete
      };

  }

  return (
    <CommentGroup>
      <Form reply>
        <TextArea
          placeholder="Add a new comment..."
          value={commentText}  // Bind TextArea to the state
          onChange={handleChange}  // Update state on change
        />
        <Button
          content="Add a new comment..."
          labelPosition="left"
          icon="edit"
          primary
          style={{ marginTop: '10px' }}
          onClick={handlePostComment}  // Example action for the Add button
          loading={loading}
          disabled={loading}
        />
        <Button 
          onClick={handleDelete}  // Clears the text area when clicked
          secondary
        >
          Clear
        </Button>
      </Form>
    </CommentGroup>
  );
};

export default AddComment;
