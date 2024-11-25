import React, { useState, useRef } from 'react';
import { Form, TextArea, Button } from 'semantic-ui-react';

const AddReply = ({userId}) => {
  const [replyText, setReplyText] = useState('');
  const textareaRef = useRef(null);

  const handleChange = (e) => {
    setReplyText(e.target.value);
  };

  const handlePost = () => {
    // You can call an external function here to handle posting the reply, e.g., onPost(replyText)
    console.log("Post reply:", replyText); 
    setReplyText(''); // Clear the text area after posting
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
      <Button onClick={handleDelete} secondary>Delete</Button>
    </Form>
  );
};

export default AddReply;
