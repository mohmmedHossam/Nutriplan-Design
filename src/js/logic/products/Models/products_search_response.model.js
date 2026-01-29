export class ProductsSearchResponse {
  constructor({ count = 0, results = [] }) {
    this.count = count;
    this.results = results;
  }

  static fromJson(json = {}) {
    return new ProductsSearchResponse({
      count: json.count ?? 0,
      results: (json.results ?? []).map((item) => Product.fromJson(item)),
    });
  }
}

export class Product {
  constructor({ barcode, name, image, nutritionGrade, novaGroup, nutrients }) {
    this.barcode = barcode ?? "";
    this.name = name ?? "";
    this.image = image ?? "";
    this.nutritionGrade = nutritionGrade ?? "";
    this.novaGroup = novaGroup ?? "";
    this.nutrients = nutrients;
  }

  static fromJson(json = {}) {
    return new Product({
      barcode: json.barcode,
      name: json.name,
      image: json.image,
      nutritionGrade: json.nutritionGrade,
      novaGroup: json.novaGroup,
      nutrients: Nutrients.fromJson(json.nutrients),
    });
  }
}

export class Nutrients {
  constructor({ calories = 0, protein = 0, fat = 0, carbs = 0, sugar = 0 }) {
    this.calories = calories;
    this.protein = protein;
    this.fat = fat;
    this.carbs = carbs;
    this.sugar = sugar;
  }

  static fromJson(json = {}) {
    return new Nutrients({
      calories: json.calories ?? 0,
      protein: json.protein ?? 0,
      fat: json.fat ?? 0,
      carbs: json.carbs ?? 0,
      sugar: json.sugar ?? 0,
    });
  }
}
