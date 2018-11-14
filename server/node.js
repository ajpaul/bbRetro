const app = require('express')();
const events = require('./events');
const http = require('http').Server(app);
const io = require('socket.io')(http);

let state = {};
let auditLog = {};
let stateId = 0;
let auditId = 0;
let totalUsers = 0;
let admin = { status: true, id: '', adminName: '' };
let adminConfig = {};

io.on('connection', (socket) => {

    // update user count and send to all connections
    totalUsers++;
    events.userCount(io, totalUsers);

    // send all data to the socket that just opened by socket id
    io.to(`${socket.id}`).emit('allData', JSON.stringify(state));
    
    // what if the admin refreshes?
    // client needs to maintain admin status
    if(admin.status || socket.id === admin.id) { // for reconnections
        admin.status = false;
        admin.id = socket.id;
        io.emit('admin', { admin: admin.id, status: true, adminName: '' });
    } 
    else
        io.emit('admin', { admin: admin.id, status: false, adminName: admin.adminName });

    socket.on('newItem', (item) => {
        const retroItem = events.newItem(item, io, stateId, socket.id);
        addItemToDB(retroItem);
        audit('newItem');
    });

    socket.on('upvote', (item) => {
        events.upvote(item, io);
        updateState('upvote', item.id);
        audit('upvote');
    });
     
    socket.on('downvote', (item) => {
        events.downvote(item, io);
        updateState('downvote', item.id);
        audit('downvote');
    });

    socket.on('deleteItem', (item) => {
        events.deleteItem(item, io);
        // need to update state
        audit('deleteItem');
    });

    socket.on('disconnect', () => {
        totalUsers--;
        events.userCount(io, totalUsers);
        audit('userCount change');
    });

    socket.on('adminConfig', (config) => {
        adminConfig = config;
        admin.adminName = config.adminName;
    });
});

// Initialize our websocket server on port 5000
http.listen(5000, () => {
    console.log('started on port 5000');
});

// refactor these out to a helpers file
function addItemToDB(record) {
    state[stateId] = record;
    stateId++;
    console.log(state);
}

function audit(action){
    auditLog[auditId] = action;
}

function updateState(event, id) {
    if(state[id]){
        switch(event) {
            case 'upvote':
                state[id].upvotes++;
                break;
            case 'downvote':
                state[id].downvotes++;
                break;
        }
    }

    console.log('updated state!');
    console.log(state);
}

