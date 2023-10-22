'use client';

import {
  Box,
  Button,
  Divider,
  Flex,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import * as PushProtocolAPI from '@pushprotocol/restapi';
import { IFeeds, IUser, PushAPI } from '@pushprotocol/restapi';
import { STREAM } from '@pushprotocol/restapi/src/lib/pushstream/pushStreamTypes';
import { createSocketConnection, EVENTS } from '@pushprotocol/socket';
import {
  ChatUIProvider,
  ChatViewComponent,
  darkChatTheme,
  ENV,
} from '@pushprotocol/uiweb';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

import { useAuthKit } from '@/hooks/useAuthKit';
import { useSDKSocket } from '@/hooks/useSDKSocket';
import { pCAIP10ToWallet } from '@/utils/pushHelper';
import shortenWalletAddress from '@/utils/shortenWalletAddress';

import { AccountContext, SocketContext } from '../context';

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

const ChatViewComponentCard = styled(Section)`
  height: 60vh;
`;

function Chat() {
  const { web3Provider, ownerAddress, safeAddress } = useAuthKit();

  const [isCAIP, setIsCAIP] = useState(false);
  const [signer, setSigner] = useState<any>();
  const [spaceId, setSpaceId] = useState<string>('');
  const [pgpPrivateKey, setPgpPrivateKey] = useState<string>('');

  const [chatList, setChatList] = useState<IFeeds[]>();

  const [selectedChat, setSelectedChat] = useState<string | undefined>('');

  const [owner, setOwner] = useState<PushAPI>();
  const [ownerInfo, setOwnerInfo] = useState<IUser>();

  const [isSendingMessage, setisSendingMessage] = useState(false);

  const socketData = useSDKSocket({
    account: ownerAddress,
    chainId: 137, // polygon chainId
    env: ENV.PROD,
    isCAIP,
  });

  useEffect(() => {
    (async () => {
      if (!web3Provider || owner) {
        return;
      }

      const ownerSigner = web3Provider.getSigner();
      const ownerAdd = await ownerSigner.getAddress();

      const chatOwner = await PushProtocolAPI.PushAPI.initialize(ownerSigner, {
        env: ENV.PROD,
      });

      const chatOwnerInfo = await chatOwner.info();

      if (chatOwnerInfo.encryptedPrivateKey) {
        const pgpPrvKey = await PushProtocolAPI.chat.decryptPGPKey({
          encryptedPGPPrivateKey: chatOwnerInfo.encryptedPrivateKey,
          account: ownerAdd,
          signer: ownerSigner,
          env: ENV.PROD,
        });

        setPgpPrivateKey(pgpPrvKey);

        console.warn('pgpPrvKey', pgpPrvKey);
      }

      setSigner(ownerSigner);
      setOwner(chatOwner);
      setOwnerInfo(chatOwnerInfo);

      fetchChatList(chatOwner);
      console.warn('chatOwner', chatOwner);
      console.warn('info', chatOwnerInfo);

      console.warn('xownerAdd', ownerAdd);

      console.warn('chat', chatOwner.chat);
      console.warn('profile', chatOwner.profile);
      console.warn('encryption', chatOwner.encryption);

      // Create Socket to Listen to incoming messages
      const pushSDKSocket = createSocketConnection({
        user: ownerAddress,
        socketType: 'chat',
        socketOptions: { autoConnect: true, reconnectionAttempts: 3 },
        env: ENV.PROD,
      });

      if (pushSDKSocket) {
        console.warn('pushSDKSocket EXIST : ', pushSDKSocket);

        // React to message payload getting received
        pushSDKSocket.on(EVENTS.CHAT_RECEIVED_MESSAGE, async (message) => {
          console.log(message);

          //  refresh chat
          await fetchChatList(chatOwner);

          // auto accept all request
          if (message.origin === 'other') {
            const walletAdd = pCAIP10ToWallet(message.from);
            await chatOwner.chat.accept(walletAdd);

            console.warn(
              'accepted request from : ',
              pCAIP10ToWallet(message.from),
            );

            setSelectedChat(walletAdd);
          }
        });
      }

      // Listen for chat
      chatOwner.stream.on(STREAM.CHAT, (data: any) => {
        console.log(data);
      });

      chatOwner.stream.on(STREAM.CHAT_OPS, (data: any) => {
        console.log(data);
      });
    })();
  }, [chatList, owner, ownerAddress, selectedChat, web3Provider]);

  const chatListAllChat =
    chatList &&
    chatList?.map((item, index: number) =>
      pCAIP10ToWallet(item.did) && pCAIP10ToWallet(item.did).length > 0 ? (
        <Button
          style={{
            border:
              selectedChat === pCAIP10ToWallet(item.did)
                ? '5px solid green'
                : '',
          }}
          key={shortenWalletAddress(pCAIP10ToWallet(item.did))}
          variant="contained"
          m={8}
          size="md"
          onClick={() => {
            console.log('set chat to ', pCAIP10ToWallet(item.did));

            setSelectedChat(item.did && pCAIP10ToWallet(item.did));
          }}
        >
          {shortenWalletAddress(pCAIP10ToWallet(item.did))}
        </Button>
      ) : null,
    );

  const fetchChatList = async (chatOwner: PushAPI) => {
    console.warn('getting chat list');
    const cList = await chatOwner.chat.list('CHATS');

    setChatList(cList);

    cList.forEach((item, index) => {
      console.error(' INDEX ', index);

      console.log('xxx about', item.about);

      console.warn('xxx chatId', item.chatId);

      console.debug('xxx did', item.did);

      console.log('xxx', item.intent);
    });

    console.error('xchatList', cList);
  };

  const chatListHistory =
    chatList &&
    chatList?.map((item, index) =>
      item.chatId && pCAIP10ToWallet(item.did) === selectedChat ? (
        <div key={index} id={`chatListHistory` + index}>
          <ChatViewComponentCard>
            <ChatViewComponent
              chatId={item.chatId}
              limit={25}
              isConnected={true}
              autoConnect={false}
            />
          </ChatViewComponentCard>
        </div>
      ) : null,
    );

  const form = useForm({
    initialValues: {
      walletAddress: '',
      userMesssage: 'Hi',
    },

    validate: {
      walletAddress: (value) =>
        value === ownerAddress
          ? 'You cannot chat with yourself'
          : value.length === 0
          ? 'Wallet Addresss cannot be empty'
          : value.length !== 42
          ? 'Wallet Address is not valid'
          : null,

      userMesssage: (value) =>
        value.length === 0 ? 'Your message cannot be empty' : null,
    },
  });

  const sendMessage = async (wAddress: string, uMessage: string) => {
    if (owner && wAddress && uMessage) {
      const messageReq = await owner.chat.send(wAddress, {
        type: 'Text',
        content: uMessage,
      });

      const chatList = await fetchChatList(owner);

      setSelectedChat(wAddress);

      console.warn('x messageReq', messageReq);
    }
  };

  return owner ? (
    <Stack>
      <Text>All Conversations</Text>
      <Flex py={16} justify="center" align="center" direction="row" wrap="wrap">
        {chatListAllChat}
      </Flex>

      <Text>Your chat Address : {ownerAddress}</Text>
      <Divider px={16} />
      <Text>Selected Chat : {selectedChat}</Text>

      <Box>
        <form
          onSubmit={form.onSubmit(
            (values: { walletAddress: string; userMesssage: string }) => {
              console.log(values);

              sendMessage(values.walletAddress, values.userMesssage);
            },
          )}
        >
          <TextInput
            label="Wallet Address"
            placeholder="Wallet Address"
            {...form.getInputProps('walletAddress')}
          />
          <TextInput
            label="Your message"
            placeholder="Your Message"
            {...form.getInputProps('userMesssage')}
          />
          <Button
            type="submit"
            mt="md"
            size={'sm'}
            fullWidth
            loading={isSendingMessage}
            disabled={isSendingMessage}
          >
            Start a chat
          </Button>
        </form>
      </Box>
      <SocketContext.Provider value={socketData}>
        <AccountContext.Provider value={{ pgpPrivateKey, setSpaceId }}>
          <ChatUIProvider
            theme={darkChatTheme}
            account={ownerAddress}
            signer={signer}
            pgpPrivateKey={pgpPrivateKey}
            env={ENV.PROD}
          >
            {chatListHistory}
          </ChatUIProvider>
        </AccountContext.Provider>
      </SocketContext.Provider>
    </Stack>
  ) : (
    <>
      <Text>Please Sign-in to chat</Text>
    </>
  );
}

export default Chat;
