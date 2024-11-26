import React, { useState, useRef, useEffect,useMemo } from "react";
import {
  TextArea,
  Comment,
  CommentGroup,
  CommentContent,
  CommentAvatar,
  CommentMetadata,
  CommentActions,
  CommentAction,
  CommentAuthor,
  Button,
  Form,
} from "semantic-ui-react";
import moment from "moment";
import { fetchRepliesByCommentId, addReply } from "../Services/api";

const ReplyComponent = ({ id, userId, postId, createdtime, content, commentId,onReplyPosted }) => {
  const [isReplyVisible, setIsReplyVisible] = useState(false);
  const [replies, setReplies] = useState([]);
  const [replyText, setReplyText] = useState("");
  const [error, setError] = useState(null);
  const textareaRef = useRef(null);

  // Memoize formattedTime to prevent unnecessary recalculations
  // const formattedTime = useMemo(() => moment(createdtime).format("DD/MM/YYYY, hh:mm A"), [createdtime]);

  const toggleReplyVisibility = () => {
    setIsReplyVisible(!isReplyVisible);
  };

  const handleChange = (e) => {
    setReplyText(e.target.value);
  };

  const fetchReplies = async () => {
    try {
      const response = await fetchRepliesByCommentId(commentId);

      if (response.status !== 200 && response.status !== 201) {
        throw new Error(`Error: ${response.statusText}`);
      }

      let data = response.data;
      setReplies(data);
      
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    fetchReplies();
  }, [commentId]);

  const handlePost = async () => {
    if (!replyText.trim()) {
      setError("Reply cannot be blank.");
      return;
    }

    try {
      const response = await addReply(commentId, { content: replyText, userId });

      if (response.status === 200 || response.status === 201) {
        setReplyText(""); // Clear the input
        fetchReplies(); // Refresh replies
        if (onReplyPosted){
          onReplyPosted();
        }
      }
    } catch (err) {
      setError("Failed to post reply.");
    }
  };

  const handleClear = () => {
    setReplyText("");
  };

  return (
    <CommentGroup>
      <Comment>
        <CommentAvatar src="https://react.semantic-ui.com/images/avatar/small/jenny.jpg" />
        <CommentContent>
          <CommentAuthor as="a">{userId}</CommentAuthor>
          <CommentMetadata>
            <div>{createdtime}</div>
          </CommentMetadata>
          <Comment.Text>{content}</Comment.Text>
          <CommentActions>
            <Button
              style={{
                backgroundColor: "transparent",
                boxShadow: "none",
                color: "#4183c4",
                padding: "0",
              }}
              size="tiny"
              onClick={toggleReplyVisibility}
            >
              {isReplyVisible ? "Cancel" : "Reply"}
            </Button>
          </CommentActions>

          {isReplyVisible && (
            <Form>
              <Form.Field>
                <TextArea
                  ref={textareaRef}
                  value={replyText}
                  onChange={handleChange}
                  placeholder={`Write a reply to ${userId}...`}
                />
              </Form.Field>
              <Button onClick={handlePost} primary>
                Post
              </Button>
              <Button onClick={handleClear} secondary>
                Clear
              </Button>
            </Form>
          )}
        </CommentContent>
      </Comment>
    </CommentGroup>
  );
};

export default ReplyComponent;
