## Ratel Voice Example (client web app)
This is a proof of concept for using blockchain incentive to obtain AI data.

You can test entire flow from obtaining data for AI training in exchange for tokens on a ethereum private network to train model to serve service.  

This example is for voice recognition system.
>  you can try it without blockchain parts if you want   
For more information about the idea, please check [website](https://ratelnetwork.com).  

## Features
1. Import texts from epub for data contributors to read out
2. Data contributors can record voice. the voice and meta data is saved on mongodb.
3. Issue token on private ethereum network in exchange for data
4. Train AI model on jupyter notebook
5. Test the model at webstie


## Server side
For server side scripts, please check [here](https://github.com/kouohhashi/ratel_voice_server_example)  

## Demo
Here's a live [demo](https://ratel_voice.grabit.co/)  This is only for testing purpose.

## How to setup this system

### download the repository  
```
git clone https://github.com/kouohhashi/ratel_voice_web_client_example.git
```

### go to directory
```
cd ratel_voice_web_client_example/
```

### create Settings.js
```
cp src/utils/Settings_example.js src/utils/Settings.js
```

### edit Settings.js
```
vi Settings.js
```

### install npm modules
```
npm install
```

### start react
```
npm run start
```

### import text
You need to import text for data contributors.   
To do that you can open text importer feature.  
http://localhost:3000/admin/upload_epub  
And download any epub file to upload it. Server shold parse it and store texts on mongoDB.  


## Now appliation is ready
http://localhost:3000/

1. create account
2. record voice
3. train model on server

if you don't need to issue token, you can turn off blockchain feature here.
http://localhost:3000/admin/dashboard

### Todos
- More document
- UIs for other AI projects

### Tech stack
- React

## License  
MIT. You can do whatever you want.  
