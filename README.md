# Connect 4

Connect-4 game using NodeJS and websockets.

[*Demo*](https://connect-4-x.herokuapp.com)

## Getting Started

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
