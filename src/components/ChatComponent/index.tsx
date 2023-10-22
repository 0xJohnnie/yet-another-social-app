'use client';

import {
  ChatViewComponent,
  ChatViewList,
  CreateGroupModal,
} from '@pushprotocol/uiweb';
import styled from 'styled-components';

export const Section = styled.section`
  border: 2px solid #ccc;
  padding: 25px;
  margin: 10px 0;
  display: flex;
  flex-direction: column;
  background-color: ${'#000'};

  & .headerText {
    color: '#fff';
    font-size: 2rem;
  }

  & .subHeaderText {
    color: '#fff';
    font-size: 1.2rem;
  }
`;

const ChatViewListCard = styled.div`
  height: 40vh;
  background: black;
  overflow: auto;
  overflow-x: hidden;
`;

function ChatComponent() {
  return (
    <div>
      <ChatViewComponentCard>
        <ChatViewComponent
          onGetTokenClick={() => console.log('BOIIII RETURNNNSSSSS')}
          chatId=""
          limit={10}
          isConnected={true}
          autoConnect={true}
        />
      </ChatViewComponentCard>
    </div>
  );
}

const ChatViewComponentCard = styled(Section)`
  height: 60vh;
`;

export default ChatComponent;
