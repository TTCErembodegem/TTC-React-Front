export default class PlayerModel {
  constructor(json) {
    for (let prop in json) {
      if (json.hasOwnProperty(prop)) {
        this[prop] = json[prop];
      }
    }
  }

  // get club() {
  //   return this.id;
  // };
}