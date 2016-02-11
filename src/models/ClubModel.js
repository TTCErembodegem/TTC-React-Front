export const OwnClubId = 1;

export default class ClubModel {
  constructor(json) {
    this.active = json.active;
    this.alternativeLocations = json.alternativeLocations;
    this.codeSporta = json.codeSporta;
    this.codeVttl = json.codeVttl;
    this.id = json.id;
    this.mainLocation = json.mainLocation;
    this.managers = json.managers;
    this.name = json.name;
    this.shower = json.shower;
    this.website = json.website;
  }
}