class Message {
    constructor(db) {
      this.messages = [];
      this.nextId = 1;
    }
  
    createMsg(login, content, imageUrl) {
      return new Promise((resolve, reject) => {
        const msg = {
          id: this.nextId,
          login: login,
          content: content,
          imageUrl: imageUrl,
          comments: [],
          likes: [],
          created_at: new Date()
        };
  
        this.messages.push(msg);
        this.nextId++;
  
        resolve(msg.id);
      });
    }
  
    deleteMsg(msg) {
      return new Promise((resolve, reject) => {
        const index = this.messages.findIndex((m) => m.id === msg.id);
  
        if (index !== -1) {
          this.messages.splice(index, 1);
          resolve(true);
        } else {
          reject(false);
        }
      });
    }
  
    findMsgById(id) {
      return new Promise((resolve, reject) => {
        const msg = this.messages.find((msg) => msg.id === id);
        if (msg) {
          resolve(msg);
        } else {
          reject(`Message with id ${id} not found`);
        }
      });
    }
  
    addComment(msg, comment) {
      return new Promise((resolve, reject) => {
        const m = this.findMsgById(msg.id);
        if (m) {
          m.comments.push(comment);
          resolve(true);
        } else {
          reject(false);
        }
      });
    }
  
    likeMsg(msg, user) {
      return new Promise((resolve, reject) => {
        const m = this.findMsgById(msg.id);
  
        if (m) {
          if (!m.likes.includes(user)) {
            m.likes.push(user);
          }
          resolve(true);
        } else {
          reject(false);
        }
      });
    }
  
    unlikeMsg(msg, user) {
      return new Promise((resolve, reject) => {
        const m = this.findMsgById(msg.id);
  
        if (m) {
          const index = m.likes.indexOf(user);
          if (index !== -1) {
            m.likes.splice(index, 1);
          }
          resolve(true);
        } else {
          reject(false);
        }
      });
    }
  }
  
  module.exports = Message;
  