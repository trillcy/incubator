const part = {
  collocation: ['на', null],
  params: { parameter4Id: [2], parameter2Id: [1, 2] },
}
const word1 = {
  word: 'студентке',
  lemma: 'студент',
  type: 'noun',
  parameter1Id: null,
  parameter2Id: 2,
  parameter3Id: 1,
  parameter4Id: 2,
}
const word2 = {
  word: 'студенте',
  lemma: 'студент',
  type: 'noun',
  parameter1Id: null,
  parameter2Id: 1,
  parameter3Id: 1,
  parameter4Id: 2,
}
const word3 = {
  word: 'хорошей',
  lemma: 'хороший',
  type: 'adj',
  parameter1Id: null,
  parameter2Id: 2,
  parameter3Id: 1,
  parameter4Id: 2,
}
const word4 = {
  word: 'хорошем',
  lemmaId: 'хороший',
  type: 'adj',
  parameter1Id: null,
  parameter2Id: 1,
  parameter3Id: 1,
  parameter4Id: 2,
}
const collocation1 = ['на', 'студентке']
const collocation2 = ['на', 'студенте']

const collocation3 = ['на', 'хорошей', 'студентке']
const collocation4 = ['на', 'хорошем', 'студентке']

class Part {
  constructor() {}
  createCollocation() {}
}

class Collocation {
  constructor(part, lemma) {}
}
