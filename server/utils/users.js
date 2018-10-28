
class Users{
  constructor(){
    this.users = [];
  }
  addUser(id,name,room){
    var user = {id ,name, room};
    this.users.push(user);
    return user;
  }
  removeUser(id){
    var deletedPerson = this.users.filter(function(item){
      return item.id === id;
    })
    this.users = this.users.filter(function(item){
      return item.id != id;
    });
    return deletedPerson;
  }
  getUser(id){
    var specificUser = this.users.filter(function(item){
      if (item.id === id) return item
    });
    return specificUser;
  }
  getUserList(room){
    var loggedInRoom = this.users.filter(function(item){
      if (item.room === room) return item
    });
    var namesArray = loggedInRoom.map(function(user){
      return user.name
    });
    return namesArray;
  }
}


module.exports = {Users};
