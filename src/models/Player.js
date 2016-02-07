export default class Player {
  constructor(json) {
    for (var prop in json) {
      this[prop] = json[prop];
    }


  };

  // get club() {
  //   return this.id;
  // };
};