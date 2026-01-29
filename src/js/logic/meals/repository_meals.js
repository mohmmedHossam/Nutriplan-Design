import { BaseApiService } from "/src/js/apis/baseApiServices.js";
import { routes } from "/src/js/apis/apiRoutes.js";
import { CategoriesResponse } from "./Models/meals_categories_model.js";
import { AreasResponse } from "./Models/meals_areas_model.js";
import { MealsResponse } from "./Models/meals_model.js";
import { MealResponse } from "./Models/meals_model.js";
import { NutritionAnalyzeResponse } from "./Models/nutrition_model.js";

// const CategoriesModel = require("");
export class MealsRepository extends BaseApiService {
  static async getAreas() {
    var areasResponse = await super.get(routes.mealsAreas);
    if (areasResponse != null) {
      var areas = AreasResponse.fromJson(areasResponse).areas;
      return areas;
    }
  }

  static async getCategories() {
    var categoriesResponse = await super.get(routes.mealsCategories);
    if (categoriesResponse != null) {
      var categoriesResponse =
        CategoriesResponse.fromJson(categoriesResponse).categories;
      return categoriesResponse;
    }
  }

  static async getMealsRandom() {
    var mealsResponse = await super.get(routes.mealsRandom, { count: 25 });
    if (mealsResponse != null) {
      var mealsRondmResponse = MealsResponse.fromJson(mealsResponse).results;
      return mealsRondmResponse;
    }
  }
  static async filterMeals(category = "", area = "", ingredient = "") {
    var mealsResponse = await super.get(routes.mealsFilter, {
      category: category,
      area: area,
      limit: 25,
    });
    if (mealsResponse != null) {
      var mealsRondmResponse = MealsResponse.fromJson(mealsResponse).results;
      return mealsRondmResponse;
    }
  }

  static async getMealDetails(id) {
    var mealsResponse = await super.get(`${routes.mealsDetalis}${id}`);
    if (mealsResponse != null) {
      var mealsRondmResponse = MealResponse.fromJson(mealsResponse).result;
      return mealsRondmResponse;
    }
  }

  static async getNutritionAnalyze(name, ingredients) {
    var nutritionAnalyzeResponse = await super.post(routes.nutritionAnalyze, {
      name: name,
      ingredients: ingredients,
    });

    if (nutritionAnalyzeResponse != null) {
      var nutritionAnalyze = NutritionAnalyzeResponse.fromJson(
        nutritionAnalyzeResponse
      ).data;
      return nutritionAnalyze;
    }
  }
}
