function calAndConvTotalWidthToEM (element, bonus) {
  const computedStyle = window.getComputedStyle(element);
  const fontSize = parseFloat(computedStyle.fontSize);
  const elementTotalWidthPX = bonus ? element.scrollWidth + bonus : element.scrollWidth;
  const elementTotalWidthEM = elementTotalWidthPX /fontSize;
  return elementTotalWidthEM;
}

export default calAndConvTotalWidthToEM;