export class NutritionValues {
  constructor(
    calories,
    protein,
    fat,
    carbs,
    fiber,
    sugar,
    saturatedFat,
    cholesterol,
    sodium
  ) {
    this.calories = calories;
    this.protein = protein;
    this.fat = fat;
    this.carbs = carbs;
    this.fiber = fiber;
    this.sugar = sugar;
    this.saturatedFat = saturatedFat;
    this.cholesterol = cholesterol;
    this.sodium = sodium;
  }

  static fromJson(json) {
    return new NutritionValues(
      json.calories,
      json.protein,
      json.fat,
      json.carbs,
      json.fiber,
      json.sugar,
      json.saturatedFat,
      json.cholesterol,
      json.sodium
    );
  }
}

export class ParsedIngredient {
  constructor(quantity, unit, foodName) {
    this.quantity = quantity;
    this.unit = unit;
    this.foodName = foodName;
  }

  static fromJson(json) {
    if (!json) return null;
    return new ParsedIngredient(json.quantity, json.unit, json.foodName);
  }
}

export class MatchedFood {
  constructor(fdcId, description, dataType) {
    this.fdcId = fdcId;
    this.description = description;
    this.dataType = dataType;
  }

  static fromJson(json) {
    if (!json) return null;
    return new MatchedFood(json.fdcId, json.description, json.dataType);
  }
}

export class AnalyzedIngredient {
  constructor(original, parsed, matched, grams, nutrition) {
    this.original = original;
    this.parsed = parsed;
    this.matched = matched;
    this.grams = grams;
    this.nutrition = nutrition;
  }

  static fromJson(json) {
    return new AnalyzedIngredient(
      json.original,
      ParsedIngredient.fromJson(json.parsed),
      MatchedFood.fromJson(json.matched),
      json.grams,
      NutritionValues.fromJson(json.nutrition)
    );
  }
}

export class NutritionData {
  constructor(
    recipeName,
    servings,
    totalWeight,
    totals,
    perServing,
    ingredients
  ) {
    this.recipeName = recipeName;
    this.servings = servings;
    this.totalWeight = totalWeight;
    this.totals = totals;
    this.perServing = perServing;
    this.ingredients = ingredients;
  }

  static fromJson(json) {
    return new NutritionData(
      json.recipeName,
      json.servings,
      json.totalWeight,
      NutritionValues.fromJson(json.totals),
      NutritionValues.fromJson(json.perServing),
      json.ingredients?.map(AnalyzedIngredient.fromJson) ?? []
    );
  }
}

export class NutritionAnalyzeResponse {
  constructor(success, data) {
    this.success = success;
    this.data = data;
  }

  static fromJson(json) {
    return new NutritionAnalyzeResponse(
      json.success,
      json.data ? NutritionData.fromJson(json.data) : null
    );
  }
}
  