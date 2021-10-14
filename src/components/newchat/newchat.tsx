import { Component, h } from '@stencil/core';
import { withHooks, useState, useEffect } from '@saasquatch/stencil-hooks';
import { HubConnectionBuilder, LogLevel, HubConnection } from '@microsoft/signalr';
import { Guid } from 'js-guid';
import { dateISOLocalTime, getTimeFromISOString } from '../../utils/utils';

// const mockMessages = [
//   {
//     id: Guid.newGuid().toString(),
//     text: 'Hello developer',
//     createdAt: new Date(),
//     user: {
//       id: 3,
//       name: 'User 2',
//     },
//   },
//   {
//     id: Guid.newGuid().toString(),
//     text: 'Hello world',
//     createdAt: new Date(),
//     user: {
//       id: 2,
//       name: 'User 1',
//     },
//   },
//   {
//     id: Guid.newGuid().toString(),
//     text: 'Info message',
//     createdAt: new Date(),
//     system: true,
//     systemType: 'Info',
//   },
// ];

@Component({
  tag: 'new-chat-pane',
  styleUrl: 'newchat.css',
  shadow: true,
})
export class NewChatPane {
  constructor() {
    withHooks(this);
  }

  disconnectedCallback() {}

  render() {
    const [connection, setConnection] = useState<HubConnection | null>(null);
    const [messages, setMessages] = useState<any>([]);
    const [message, setMessage] = useState<any>([]);

    const [name, setName] = useState('');
    const [room, setRoom] = useState('');

    // useEffect(() => {
    //   setMessages(mockMessages);
    // }, []);

    const joinRoom = async (user: any, room: any) => {
      try {
        const connection = new HubConnectionBuilder().withUrl('https://localhost:44397/chat').configureLogging(LogLevel.Information).build();

        connection.on('RecieveMessage', message => {
          console.log(message);
          setMessages((messages: any) => [...messages, message]);
        });

        connection.onclose(e => {
          setConnection(null);
          setMessages([]);
        });

        await connection.start();
        await connection.invoke('JoinRoom', { user, room }); // Anropar en metod på servern med namnet JoinRoom, och skickar in ett objekt innehållande användare och rum
        setConnection(connection);
      } catch (e) {
        console.log(e);
      }
    };

    const sendMessage = async (message: any) => {
      try {
        const m = {
          id: Guid.newGuid().toString(),
          text: message,
          createdAt: dateISOLocalTime(new Date()),
          user: {
            id: 2,
            name: name,
            avatar: '',
          },
        };
        if (connection) {
          await connection.invoke('SendMessage', m);
          setMessage('');
        }
      } catch (e) {
        console.log(e);
      }
    };

    const closeConnection = async () => {
      try {
        await connection.stop();
      } catch (e) {
        console.log(e);
      }
    };

    const handleSubmit = e => {
      e.preventDefault();
      joinRoom(name, room);
      // send data to our backend
    };

    const handleSubmitMessage = e => {
      e.preventDefault();
      sendMessage(message);
      // send data to our backend
    };

    const handleMessageChange = (e: any) => {
      setMessage(e.target.value);
    };

    const handleNameChange = (e: any) => {
      setName(e.target.value);
    };

    const handleRoomChange = (e: any) => {
      setRoom(e.target.value);
    };

    if (connection)
      return (
        <div class="wrapper">
          <div class="pane">
            <div class="header">
              <div class="top-bar">
                <div>vaulter</div>
                <div>
                  <button
                    onClick={() => {
                      closeConnection();
                    }}
                  >
                    Leave room
                  </button>
                </div>
              </div>
              <div class="action-bar">
                <div class="action-bar-text">
                  <div class="action-bar-article">Hagström gitarr</div>
                  <div>2500 kr</div>
                </div>
                <div class="action-bar-actions">
                  <button
                    onClick={() => {
                      console.log('godkänn');
                    }}
                    class="action-bar-button item-1"
                  >
                    GODKÄNN
                  </button>
                  <button
                    onClick={() => {
                      console.log('avbryt');
                    }}
                    class="action-bar-button item-2"
                  >
                    AVBRYT
                  </button>
                </div>
              </div>
            </div>
            <div class="content">
              <section class="messages">
                {messages.map((m: any, index: number) => {
                  console.log(m);
                  if (m.user) {
                    if (m.user.id === 2)
                      return (
                        <div key={index} class="msg msg--me">
                          <blockquote>
                            {m.text} <div class="msg-date">{getTimeFromISOString(m.createdAt)}</div>
                          </blockquote>
                        </div>
                      );
                    else
                      return (
                        <div key={index} class="msg msg--them">
                          <blockquote>
                            {m.text}
                            <div class="msg-date">{getTimeFromISOString(m.createdAt)}</div>
                          </blockquote>
                        </div>
                      );
                  } else
                    return (
                      <div key={index} class="msg msg--system">
                        <blockquote>System message</blockquote>
                      </div>
                    );
                })}
              </section>
            </div>
            <div class="footer">
              <div class="msg-send">
                <form class="msg-form" onSubmit={e => handleSubmitMessage(e)}>
                  <input class="chat-input" value={message} onInput={event => handleMessageChange(event)} placeholder="Type a message..." />
                  {/* <button type="submit" value="Submit">
                    Send
                  </button> */}
                </form>
              </div>
            </div>
          </div>
        </div>
      );
    else
      return (
        <div class="wrapper">
          <div class="pane">
            <div class="header">
              <div>vaulter</div>
            </div>
            <div class="content">
              <form onSubmit={e => handleSubmit(e)}>
                <div>
                  <label>
                    Name:
                    <input type="text" value={name} onInput={event => handleNameChange(event)} />
                  </label>
                </div>
                <div>
                  <label>
                    Room:
                    <input type="text" value={room} onInput={event => handleRoomChange(event)} />
                  </label>
                </div>

                <button type="submit" value="Submit">
                  Join
                </button>
              </form>
            </div>
          </div>
        </div>
      );
  }
}
