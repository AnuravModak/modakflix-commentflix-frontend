import React from "react";
import { CommentActions,Button } from "semantic-ui-react";

const AddAction =({isReplyVisible, toggleReplyVisibility})=>{
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

};

export default AddAction;