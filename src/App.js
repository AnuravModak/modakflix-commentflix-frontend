import React from 'react';
import CommentSection from './Components/CommentSection.js';
import { Container } from 'semantic-ui-react';
import './StyleSheets/CSS/App.css';
import { ReplyProvider } from './Context/ReplyContext.js'; // Import the ReplyProvider

class App extends React.Component {
  render() {
    const postId = '121'; // Replace with dynamic postId as needed

    return (
      <ReplyProvider> {/* Wrap the application with the ReplyProvider */}
        <Container>
          <header className="App-header">
            <h1>Post Comment Section</h1>
          </header>

          <main>
            <CommentSection postId={postId} />
          </main>

          <footer>
            <p>© 2024 Your App. All Rights Reserved.</p>
          </footer>
        </Container>
      </ReplyProvider>
    );
  }
}

export default App;
