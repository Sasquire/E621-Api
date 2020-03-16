# E621API Object

The `E621API` class is the interface which should be used to interact with the official API. It provides services and utilities that simplify the code you need to write to interact with e621.

Starting as a class allows you, the programmer, to instantiate multiple instances of the API. The utility offered is apparent if you need to control multiple accounts in the same code.

### Creation
Creation of a new object is simple.

`const e621 = new E621API(useragent, username?, api_key?);`

The `useragent` is required and an error thrown if it is not present. Conversely, username and api_key are optional. It is recommended to always include these fields: certain endpoints will hide information if they encounter an unauthorized request.

It is extremely important that you ***DO NOT INCLUDE ANY API KEY IN ANY CODE***. You should treat API keys like they are passwords. A recommended way to avoid putting an API key into the source is to have a configuration file. Here is an example done for nodejs.

```javascript
// source.js
const { username, api_key } = require('./config.json');
const e621 = new E621API('ua', username, api_key);

// config.json
{
	"username": "ThisIsMyUsernameOnE621",
	"api_key": "12123331221231333123123123321"
}
```