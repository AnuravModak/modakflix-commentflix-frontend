import React,{useState, useEffect} from "react";
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
  import {  fetchRepliesByCommentId } from '../Services/api';
  
  const ReplyComponent = ({id,userId,postId,time,content,commentId}) => {
    // State to manage visibility of AddReply field
      const [isReplyVisible, setIsReplyVisible] = useState(false);
      const [replies, setReplies] = useState([]);
      const [loading,setLoading]=useState(false);
      const [error, setError] = useState(null);

      // Formatting the timestamp using moment.js
      const formattedTime = moment(time).format("DD/MM/YYYY, hh:mm A");
      
      // Toggle the visibility of the reply field
      const toggleReplyVisibility = () => {
        setIsReplyVisible(!isReplyVisible);
      };

      const fetchReplies = async () => {
        try {
          setLoading(true);
          setError(null);
    
          const response = await fetchRepliesByCommentId(commentId);
    
          if (response.status !== 200 && response.status!==201) { // Check for successful status
            throw new Error(`Error: ${response.statusText}`);
          }
          
          let data = response.data; // Use response.data instead of response.json()
    
          // Sort comments by createdAt in descending order
          data = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
          setReplies(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
    
      // Fetch comments when the component mounts or postId changes
      useEffect(() => {
        fetchReplies();
      }, [commentId]);
    
      const handleRepliesPosted = () => {
        fetchReplies();
      };

      console.log("commentId replycomponent" ,commentId);

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
                {isReplyVisible && <AddReply postId={postId} userId={userId} commentId={commentId} onReplyPosted={handleRepliesPosted}/>}

            </CommentContent>
          </Comment>
        </CommentGroup>

        
       
      
    );
  };

export default ReplyComponent;