export class BarcodeResponse {
  constructor({ message = "", result = null }) {
    this.message = message;
    this.result = result ? new Product(result) : null;
  }

  static fromJson(json) {
    return new BarcodeResponse(json);
  }
}

export class Product {
  constructor({
    barcode = "",
    name = "",
    brand = "",
    image = "",
    nutritionGrade = "",
    novaGroup = 0,
    nutrients = {},
  }) {
    this.barcode = barcode;
    this.name = name;
    this.brand = brand;
    this.image = image;
    this.nutritionGrade = nutritionGrade;
    this.novaGroup = novaGroup;
    this.nutrients = new Nutrients(nutrients);
  }
}

export class Nutrients {
  constructor({
    calories = 0,
    fat = 0,
    carbs = 0,
    protein = 0,
    sugar = 0,
    fiber = 0,
    sodium = 0,
  }) {
    this.calories = calories;
    this.fat = fat;
    this.carbs = carbs;
    this.protein = protein;
    this.sugar = sugar;
    this.fiber = fiber;
    this.sodium = sodium;
  }
}
