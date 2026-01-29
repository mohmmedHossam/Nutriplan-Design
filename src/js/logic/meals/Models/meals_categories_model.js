// categories_model.js

export class Category {
  constructor({ id, name, thumbnail, description }) {
    this.id = id;
    this.name = name;
    this.thumbnail = thumbnail;
    this.description = description;
  }

  static fromJson(json) {
    return new Category(json);
  }
}

export class CategoriesResponse {
  constructor({ message, results }) {
    this.message = message;
    this.categories = results.map((item) => Category.fromJson(item));
  }

  static fromJson(json) {
    return new CategoriesResponse(json);
  }
}
