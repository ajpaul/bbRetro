module.exports = {
    userCount: function(io, totalUsers) {
        io.emit('userCount', { totalUsers: totalUsers });
    },

    newItem: function(item, io, stateId, socketId) {
        console.log('you created a message', item);
        console.log('-----------------');

        const newRetroItem = {
            text: item.text,
            id: stateId,
            upvotes: 0,
            downvotes: 0,
            creator: socketId // for validating delete privileges
        }

        io.emit('newItem', newRetroItem);

        return newRetroItem;
    },

    upvote: function(item, io){
        console.log('you upvoted an item');
        console.log(item);
        io.emit('upvote', { id: item.id });
    },

    downvote: function(item, io) {
        console.log('you downvoted an item');
        console.log(item);
        io.emit('downvote', { id: item.id });
    },

    deleteItem: function(item, io) {
        console.log('you deleted an item');
        console.log(item);
        io.emit('deleteItem', { item: `You deleted ${item.id}`});

        // check if the socketId of the request matches the creator
    },
}

// function disconnect() {
//     console.log('disconnected');
//     // decrement the current users var
// }

// // When we receive a 'message' event from our client, print out
// // the contents of that message and then echo it back to our client
// // using io.emit()
// function message(message) {
//     console.log("Message Received: " + message);
//     io.emit('message', {type:'new-message', text: message});  
// }

// function upvote(data) {
//     //socket.broadcast.emit('typing', data) // how you emit to everyone but yourself
//     console.log('you upvoted an event');
//     console.log(data);
// }

// function downvote(data) {
//     console.log('you downvoted an event');
//     console.log(data);
// }

// // only the board creator and the one who created a retro item can delete an item
// // board creator can delete whatever
// // maybe this could be a config option when you create a new board
// function deleteItem(data) {
//     console.log('you deleted an event');
//     console.log(data);
// }