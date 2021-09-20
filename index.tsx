import React, { useState, useEffect } from 'react';
import { render } from 'react-dom';
import './style.css';
import * as TMI from 'tmi.js';
import { ChatNav } from './components/ChatNav';
import { ChatContent } from './components/ChatContent';
import { MessageComponent } from './components/MessageComponent';

interface ITwitchClient {
  channels: string[];
}

const DEFAULT_OPTS: TMI.Options = {};

class TwitchClient {
  chat: TMI.Client;
  msgCallback: Function;
  constructor(opts: TMI.Options) {
    this.chat = new TMI.Client(opts);
  }
}

interface ITwitchEvent {
  target: any;
  context: any;
  msg: any;
  self: any;
}

const App = () => {
  const [messages, setMessages] = useState({} as ITwitchEvent);
  const [chatList, setChatList] = useState(new Array(8).fill('waiting...'));
  const [channelList, setChannelList] = useState([]);
  const [twitchClient, setTwitchClient] = useState<TwitchClient>(
    new TwitchClient(DEFAULT_OPTS)
  );
  const [channelInput, setChannelInput] = useState('');
  useEffect(() => {
    // console.log('chatList updated');
  }, [JSON.stringify(chatList)]);
  useEffect(() => {
    let list = chatList;
    // console.log(messages);
    if (messages.msg !== undefined) {
      list.pop();
      list.unshift({
        channel: messages.target,
        user: messages.context['display-name'],
        message: messages.msg,
      });
      setChatList([...list]);
    }
  }, [messages]);

  useEffect(() => {
    twitchClient.chat.on('message', emitMessage);
    handleConnect();
    return () => {
      handleDisconnect();
    };
  }, []);
  const channelListLog = () => {
    console.log(`Channels: ${twitchClient.chat.getChannels()}`);
  };
  const emitMessage = (target, context, msg, self) => {
    setMessages({ target: target, context: context, msg: msg, self: self });
  };
  const handleConnect = async () => {
    console.log(`State: ${twitchClient.chat.readyState()}`);
    if (twitchClient.chat.readyState() === 'CLOSED') {
      await twitchClient.chat.connect().then((c) => {
        console.log(`connected: ${c[0]} port: ${c[1]}`);
        console.log(`State: ${twitchClient.chat.readyState()}`);
      });
    }
    await twitchClient.chat
      .join(channelInput)
      .then((j) => {
        console.log(`Joined: ${j[0]}`);
        setChannelList([...twitchClient.chat.getChannels()]);
        channelListLog();
      })
      .catch((e) => console.error(e));
  };

  const handleLeave = async () => {
    await twitchClient.chat
      .part(channelInput)
      .then((d) => console.log(`Left: ${d[0]}`))
      .catch((e) => console.log(e));
    setChannelList([...twitchClient.chat.getChannels()]);
    channelListLog();
  };
  const handleDisconnect = async () => {
    await twitchClient.chat.disconnect().then((d) => {
      console.log(`disconnected: ${d[0]} port: ${d[1]}`);
      console.log(`State: ${twitchClient.chat.readyState()}`);
      channelListLog();
    });
  };
  const ChannelList = (props) => {
    return (
      <div>
        <h1>Channel List</h1>
        {props.channels.map((c) => {
          return <p key={c}>{c}</p>;
        })}
      </div>
    );
  };
  return (
    <div>
      <ChatNav>
        <div className="btn-toolbar" role="group" aria-label="...">
          <input
            type="text"
            value={channelInput}
            onChange={(e) => {
              setChannelInput(e.target.value);
            }}
          ></input>
          <button className="btn btn-outline-secondary" onClick={handleConnect}>
            Connect
          </button>
          <button className="btn btn-outline-secondary" onClick={handleLeave}>
            Leave
          </button>
          <button
            className="btn btn-outline-secondary"
            onClick={handleDisconnect}
          >
            Disconnect
          </button>
        </div>
      </ChatNav>
      <ChatContent
        main={<ChannelList channels={channelList} />}
        chat={
          <div className="list-group">
            {chatList.map((c) => {
              return (
                <MessageComponent
                  message={c.message}
                  user={c.user}
                  channel={c.channel}
                />
              );
            })}
          </div>
        }
      />
    </div>
  );
};

render(<App />, document.getElementById('root'));
