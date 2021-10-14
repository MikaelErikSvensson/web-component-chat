import { Component, h } from '@stencil/core';
import { withHooks, useState, useEffect, useRef } from '@saasquatch/stencil-hooks';
import { HubConnectionBuilder, LogLevel, HubConnection } from '@microsoft/signalr';
import { Guid } from 'js-guid';

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
  tag: 'chat-pane',
  styleUrl: 'chat.css',
  shadow: true,
})
export class ChatPane {
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

        connection.on('UsersInRoom', users => {});

        connection.on('RecieveMessage', message => {
          console.log('recieve ', message);
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
          createdAt: new Date(),
          user: {
            id: 2,
            name: name,
            avatar: '',
          },
        };
        if (connection) {
          console.log(m);
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
      console.log('submit');
      // send data to our backend
    };

    const handleSubmitMessage = e => {
      e.preventDefault();
      sendMessage(message);
      console.log('submit');
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
              <h3>vaulter</h3>
              <button
                onClick={() => {
                  closeConnection();
                }}
              >
                Leave room
              </button>
            </div>
            <div class="content">
              <div class="message-container">
                {messages.map((m: any, index: number) => {
                  return (
                    <div key={index} class="user-message">
                      {m.system ? (
                        <div class="message">
                          <div>System: {m.text}</div>
                          <div>{m.createdAt}</div>
                        </div>
                      ) : m.user.id === 2 ? (
                        <div class="message">
                          <div class="message-text">{m.text}</div>
                          <div class="message-date">{m.createdAt}</div>
                        </div>
                      ) : (
                        <div class="message">
                          <div class="message-text">{m.text}</div>
                          <div class="message-date">{m.createdAt}</div>
                        </div>
                      )}

                      {/* {m.system && <div class="message">System: {m.text}</div>}
                      {m.user.id === 2 && <div class="message">{m.text}</div>}
                      <div class="message">{m.text}</div>
                      {m.user && <div class="from-user">{m.user.name}</div>} */}
                      {/* <div class="from-user">{m.user.name}</div> */}
                    </div>
                  );
                })}
              </div>
            </div>
            <div class="footer">
              <form onSubmit={e => handleSubmitMessage(e)}>
                <input type="text" value={message} onInput={event => handleMessageChange(event)} />
                <button type="submit" value="Submit">
                  Send
                </button>
              </form>
            </div>
          </div>
        </div>
      );
    else
      return (
        <div class="wrapper">
          <div class="pane">
            <div class="header">
              <h3>vaulter</h3>
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
