import React, { useState, useRef , useEffect} from 'react';
import { Form, TextArea, Button } from 'semantic-ui-react';
import { addReply, fetchRepliesByCommentId } from '../Services/api';

const AddReply = ({postId,userId,commentId, onReplyPosted}) => {
  const [replyText, setReplyText] = useState('');
  
  const [loading,setLoading]=useState(false);
  const [error, setError] = useState(null);
  const textareaRef = useRef(null);

  const handleChange = (e) => {
    setReplyText(e.target.value);
  };

  const handlePost = async() => {
    if (!replyText.trim()){
      setError("Comment cannot be blank");
      return ;
    }
    setLoading(true);
    setError(null);

    try{
      
      console.log("commentId addreply" ,commentId);
      const response= await addReply(commentId,{content:replyText,userId:userId});

      if (response.status === 200 || response.status==201){
        setReplyText('');
        // Notify parent to refresh comments
        if (onReplyPosted){
          onReplyPosted();
        }

      }

    }
    catch (err){
      setError(err);
    }
    finally{
      setLoading(false);
    };

    
  };

  const handleDelete = () => {
    setReplyText(''); // Clear the text area
  };

  

  return (
    <Form>
      <Form.Field>
        <TextArea
          ref={textareaRef} // Directly pass ref here
          value={replyText}
          onChange={handleChange}
          placeholder={`Write a reply to ${userId}...`}
        />
      </Form.Field>
      <Button onClick={handlePost} primary>Post</Button>
      <Button onClick={handleDelete} secondary>Clear</Button>
    </Form>
  );
};

export default AddReply;
