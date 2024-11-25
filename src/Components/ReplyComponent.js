import React,{useState} from "react";
import {
    CommentText,
    CommentMetadata,
    CommentGroup,
    CommentContent,
    CommentAvatar,
    CommentActions,
    CommentAction,
    CommentAuthor,
    FormTextArea,
    Button,
    Comment,
    Form,
    Header,
  } from 'semantic-ui-react'
  import moment from 'moment';
  import AddReply from "./AddReply";
  
  const ReplyComponent = ({id,userId,time,content}) => {
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
          <Comment>
            <CommentAvatar src="https://react.semantic-ui.com/images/avatar/small/jenny.jpg" />
            <CommentContent>
              <CommentAuthor as="a">{userId}</CommentAuthor>
              <CommentMetadata>
                <div>{formattedTime}</div>
              </CommentMetadata>
              <CommentText>{content}</CommentText>
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
                {/* Conditionally render AddReply */}
                {isReplyVisible && <AddReply userId={userId} />}

            </CommentContent>
          </Comment>
        </CommentGroup>

        
       
      
    );
  };

export default ReplyComponent;