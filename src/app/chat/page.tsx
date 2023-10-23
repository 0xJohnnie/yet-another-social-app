'use client';

import {
  Box,
  Divider,
  Flex,
  Group,
  LoadingOverlay,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useViewportSize } from '@mantine/hooks';
import * as PushProtocolAPI from '@pushprotocol/restapi';
import { IFeeds, IUser, PushAPI } from '@pushprotocol/restapi';
import { STREAM } from '@pushprotocol/restapi/src/lib/pushstream/pushStreamTypes';
import { createSocketConnection, EVENTS } from '@pushprotocol/socket';
import {
  Button,
  ChatUIProvider,
  ChatViewComponent,
  darkChatTheme,
  ENV,
} from '@pushprotocol/uiweb';
import { useEffect, useState } from 'react';

import { useAuthKit } from '@/hooks/useAuthKit';
import { useSDKSocket } from '@/hooks/useSDKSocket';
import { walletToPCAIP10 } from '@/utils/pushHelper';
import shortenWalletAddress from '@/utils/shortenWalletAddress';

import { AccountContext, SocketContext } from '../context';

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

  const { width: screenWidth, height: screenHeight } = useViewportSize();

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
        user: walletToPCAIP10(ownerAddress),
        socketType: 'chat',
        socketOptions: { autoConnect: true, reconnectionAttempts: 5 },
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
            await chatOwner.chat.accept(message.from);

            console.warn('accepted request from : ', message.from);

            setSelectedChat(message.from);
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
      item.did && item.did.length > 0 ? (
        <Button
          style={{
            border: selectedChat === item.did ? '5px solid green' : '',
          }}
          key={shortenWalletAddress(item.did)}
          variant="contained"
          m={8}
          size="md"
          onClick={() => {
            console.log('set chat to ', item.did);

            setSelectedChat(item.did && item.did);
          }}
        >
          {shortenWalletAddress(item.did)}
        </Button>
      ) : null,
    );

  const fetchChatList = async (chatOwner: PushAPI) => {
    console.warn('getting chat list');
    const cList = await chatOwner.chat.list('CHATS');

    setChatList(cList);

    console.error('cList', cList);
  };

  const chatListHistory =
    chatList &&
    chatList?.map((item, index) =>
      item.chatId && item.did === selectedChat ? (
        <Flex h={screenHeight - 600} key={index} justify="space-between">
          <ChatViewComponent
            chatId={item.chatId}
            limit={8}
            isConnected={true}
            autoConnect={true}
            chatViewList={true}
            chatProfile={true}
          />
        </Flex>
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

      setSelectedChat(walletToPCAIP10(wAddress));

      console.warn('x messageReq', messageReq);
    }
  };

  return screenHeight === 0 && screenWidth === 0 ? (
    <LoadingOverlay
      visible={true}
      zIndex={1000}
      overlayProps={{ blur: 2, backgroundOpacity: 0.08, color: '#5541d9' }}
      loaderProps={{ color: 'violet', type: 'dots', size: 128 }}
    />
  ) : (
    <>
      <LoadingOverlay
        visible={!owner}
        zIndex={1000}
        overlayProps={{ blur: 2, backgroundOpacity: 0.08, color: '#5541d9' }}
        loaderProps={{ color: 'violet', type: 'dots', size: 128 }}
      />
      <Stack h={screenHeight - 200}>
        <Text>All Conversations</Text>
        <Flex
          py={16}
          justify="center"
          align="center"
          direction="row"
          wrap="wrap"
          gap={16}
        >
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
      </Stack>
    </>
  );
}

export default Chat;
