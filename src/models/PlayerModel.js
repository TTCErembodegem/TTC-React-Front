export default class PlayerModel {
  constructor(json) {
    this.alias = json.alias;
    this.contact = json.contact;
    this.id = json.id;
    this.active = json.active;
    this.name = json.name;
    this.sporta = json.sporta;
    this.vttl = json.vttl;
    this.style = json.style;
  }
}