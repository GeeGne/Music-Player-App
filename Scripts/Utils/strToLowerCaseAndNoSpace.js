function strToLowerCaseAndNoSpace (string) {
  const strLowerCase = string.toLowerCase();
  const strLowerCaseNoSpace = strLowerCase.replace(/\s/g, '');

  return strLowerCaseNoSpace;
}

export default strToLowerCaseAndNoSpace;