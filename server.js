const express=require('express')
const http=require('http')
const socketIO=require('socket.io')
const fs =require('fs')

const app=express()
const server=http.Server(app)
const io=socketIO(server)
let log=[]

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.get('/logs',function(req,res){
    res.status(200).send(log)
})


io.on('connection',function (socket){
    console.log("Connection established...")
    let linesRaw=returnLines()
    socket.emit('message', {
      'lines': linesRaw
    })
    fs.watchFile('test.log',{interval:500},(curr,prev)=>{
        log.push(curr.mtime)
        let linesRaw=returnLines()
        socket.emit('message', {
            'lines': linesRaw
        })
    })
})
const returnLines=()=>{
    const linesRaw=fs.readFileSync('test.log','utf-8')
    const lines=linesRaw.split("\n")
    if(lines[lines.length-1]==='') lines.pop()
    return lines.slice(-10)
}


server.listen(8080,()=>{
    console.log("listening on port 8080..")
})
