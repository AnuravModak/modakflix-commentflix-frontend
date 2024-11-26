import React, { useState } from 'react';
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
import AddReply from './AddReply';
// import "../StyleSheets/CSS/App.css";
import ReplyComponent from './ReplyComponent';
import AddComment from './AddComment';

const CommentComponent = ({ id, postId, author, time, text, replies }) => {
  // State to manage visibility of AddReply field
  const [isReplyVisible, setIsReplyVisible] = useState(false);

  // Formatting the timestamp using moment.js
  const formattedTime = moment(time).format("DD/MM/YYYY, hh:mm A");
  
  // Toggle the visibility of the reply field
  const toggleReplyVisibility = () => {
    setIsReplyVisible(!isReplyVisible);
  };

  return (
    
    
    <CommentGroup>
      <Comment style={{ marginTop: '25px' }}>
        <CommentAvatar src='https://react.semantic-ui.com/images/avatar/small/elliot.jpg' />
        <CommentContent>
          <CommentAuthor as='a'>{author}</CommentAuthor>
          <CommentMetadata>
            <div>{formattedTime}</div>
          </CommentMetadata>
          <CommentText>
            <p>{text}</p>
          </CommentText>
          
          <CommentActions>
            {/* Convert to Button and toggle reply visibility */}
            <Button style={{
                backgroundColor: 'transparent', // Transparent background
                boxShadow: 'none', // Remove any box shadow
                color: '#4183c4', // Optional: Match Semantic UI link color for text
                padding: '0', // Optional: Adjust padding for minimalistic look
              }} size="tiny" 
              onClick={toggleReplyVisibility}>
                        
              {isReplyVisible ? "Cancel" :"Reply"}
            </Button>
          </CommentActions>

        </CommentContent>


        {/* Nested replies */}
        {Array.isArray(replies) && replies.length > 0 && (
          replies.map((reply) => (
            <ReplyComponent
              id={reply._id}
              userId={reply.userId}
              postId={postId}
              time={reply.updatedTime}
              content={reply.content}
              commentId={id}
            />
          ))
        )}

        {/* Conditionally render AddReply */}
        {isReplyVisible && <AddReply userId={author} postId={postId} commentId={id}/>}
      </Comment>
    </CommentGroup>

  );
};

export default CommentComponent;
