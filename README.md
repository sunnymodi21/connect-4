#Connect 4

Connect-4 game using NodeJS and websockets.

Here is the [*Demo*](https://connect-4-x.herokuapp.com)

## Getting Started

### Setting up a Nodejs environment

Get started by installing [nodejs](http://www.nodejs.org).

For OS X users, use [Homebrew](http://brew.sh) and `brew install nvm`

Once that's done, from the project directory, run

```
nvm use
```

### Setting up the project

In the project directory run

```
npm install
```

### Starting the application

To start a local server run

```
npm start
```

which should produce output similar to

```
Listening on 8081
```

### Docker Setup
Build docker image for connect-4

```
docker build -t <your username>/connect-4 .
```
Run the image in detached mode

```
 docker run -p 49160:8081 -d <your username>/connect-4
 ```
