// areas_model.js

export class Area {
  constructor({ name }) {
    this.name = name;
  }

  static fromJson(json) {
    return new Area(json);
  }
}

export class AreasResponse {
  constructor({ message, results }) {
    this.message = message;
    this.areas = results.map((item) => Area.fromJson(item));
  }

  static fromJson(json) {
    return new AreasResponse(json);
  }
}
