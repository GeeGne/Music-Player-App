function calAndConvTotalWidthToEM (element) {
  const computedStyle = window.getComputedStyle(element);
  const fontSize = parseFloat(computedStyle.fontSize);
  const elementTotalWidthPX = element.scrollWidth;
  const elementTotalWidthEM = elementTotalWidthPX /fontSize;
  return elementTotalWidthEM;
}

export default calAndConvTotalWidthToEM;