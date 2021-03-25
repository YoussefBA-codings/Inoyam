/* const UserService = require("./apiService/user.service");

(async () => {
  const apiUser = new UserService('http://localhost:3001')
  const users = await apiUser.gets();
  console.log(users.data);
})()

 */


const Queue = require('queue-fifo');
var queue = new Queue();

queue.enqueue('data item 1');
queue.enqueue('data item 2');
queue.enqueue('data item 3');
queue.enqueue('data item 4');

console.log(queue)