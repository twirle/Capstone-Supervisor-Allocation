import natural from "natural";
const tokenizer = new natural.WordPunctTokenizer();

let jobScope =
  "Develop software solutions to support Amazon's e-commerce platform.";
let researchInterests = "#softwaredevelopment, #ecommerce";

// Tokenizing
let tokensJobScope = tokenizer.tokenize(jobScope.toLowerCase());
let tokensResearchInterests = researchInterests
  .toLowerCase()
  .split(", ")
  .map((tag) => tag.replace("#", ""));

console.log(tokensJobScope);
console.log(tokensResearchInterests);

// node naturaltest.js
