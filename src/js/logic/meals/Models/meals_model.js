export class Ingredient {
  constructor(ingredient, measure) {
    this.ingredient = ingredient;
    this.measure = measure;
  }

  static fromJson(json) {
    return new Ingredient(json.ingredient, json.measure);
  }
}

export class Meal {
  constructor(
    id,
    name,
    category,
    area,
    instructions,
    thumbnail,
    tags,
    youtube,
    source,
    ingredients
  ) {
    this.id = id;
    this.name = name;
    this.category = category;
    this.area = area;
    this.instructions = instructions;
    this.thumbnail = thumbnail;
    this.tags = tags;
    this.youtube = youtube;
    this.source = source;
    this.ingredients = ingredients;
  }

  static fromJson(json) {
    return new Meal(
      json.id,
      json.name,
      json.category,
      json.area,
      json.instructions,
      json.thumbnail,
      json.tags,
      json.youtube,
      json.source,
      json.ingredients.map(Ingredient.fromJson)
    );
  }
}

export class MealsResponse {
  constructor(message, results) {
    this.message = message;
    this.results = results;
  }

  static fromJson(json) {
    return new MealsResponse(
      json.message,
      json.results.map(Meal.fromJson)
    );
  }
}

export class MealResponse {
  constructor(message, result) {
    this.message = message;
    this.result = result;
  }

  static fromJson(json) {
    return new MealResponse(
      json.message,
      json.result ? Meal.fromJson(json.result) : null
    );
  }
}

