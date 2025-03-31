// src/constants/categories.js

export const CATEGORIES = [
  { number: 0, name: "국내" },
  { number: 1, name: "세계" },
  { number: 2, name: "경제" },
  { number: 3, name: "엔터" },
  { number: 4, name: "스포츠" },
  { number: 5, name: "IT" },
  { number: 6, name: "과학" },
];

// 필요한 경우 카테고리 이름만 추출하는 배열
export const CATEGORY_NAMES = CATEGORIES.map((category) => category.name);

// 필요한 경우 카테고리 번호만 추출하는 배열
export const CATEGORY_NUMBERS = CATEGORIES.map((category) => category.number);
