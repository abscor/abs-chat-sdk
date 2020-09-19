### Javascript SDK for ABS Chat

#### Example

An example of a React App utilizing this Javascript SDK for ABS Chat can be found at https://github.com/abscor/abs-chat-client-example

### How to use
#### NPM Install
```yarn add git+https://github.com/abscor/abs-chat-sdk.git```
#### NPM Install via package.json
```
  "dependencies": {
    "abs-chat-sdk": "git+https://github.com/abscor/abs-chat-sdk.git"
  },
```
#### React Admin Client Example
```
import React from 'react';
import ABSChat from "abs-chat-sdk";

const sticky_session_id = '79j2x-12s21-a98n-12ed'; // managed by you
var chat = new ABSChat('', sticky_session_id);

chat.onmessage = function (event) {
    document.getElementById('chat_messages').innerHTML = document.getElementById('chat_messages').innerHTML + '<br>' + event.data;
};

chat.adminAuth('MyUserName','MyPassword')
chat.connect();
```
#### React Web Client Example
```
import React from 'react';
import ABSChat from "abs-chat-sdk";

const sticky_session_id = '79j2x-12s21-a98n-12ed'; // managed by you
var chat = new ABSChat('my-other-api-key', sticky_session_id);

chat.onmessage = function (event) {
    document.getElementById('chat_messages').innerHTML = document.getElementById('chat_messages').innerHTML + '<br>' + event.data;
};

chat.connect();
```

#### Available functions
___
Method: `constructor` - 
```constructor(token=null, session_id=null)```

Description: Instantiate the class. 

Example ```var chat = new ABSChat('my-api-key', 'some-uuid4')```
___
Method: `connect` - 
```connect()```

Description: Connect to the socket. 

Example ```chat.connect()```
___
Method: `adminAuth` - 
```adminAuth(username, password)```

Description: Authenticate and obtain an admin token. 

Example ```adminAuth.adminAuth('SomeUserName', 'SomePassword')```
___
Method: `sendMessage` - 
```sendMessage(from_name, to_session_id, body, base64_encoded_image)```

Description: Send a message. 

Example ```chat.sendMessage('David', '79j2x-12s21-a98n-12ed', 'Hello there, how can i help?', 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==')```
___

Method: `connectionMonitorLoopStart` - 
```connectionMonitorLoopStart()```

Description: Start the socket connection monitor. 

Example ```chat.connectionMonitorLoopStart()```
___

Method: `connectionMonitorLoopStop` - 
```connectionMonitorLoopStop()```

Description: Stop the socket connection monitor. 

Example ```chat.connectionMonitorLoopStop()```
___
