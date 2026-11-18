import{expect,test}from'vitest';import{contentNumericSignature}from'../packages/shared/src/content-numeric';
test('fractions, ranges and numeric order remain distinct while typographic equivalents agree',()=>{
 expect(contentNumericSignature('1/2 cup')).not.toBe(contentNumericSignature('2/1 cup'));
 expect(contentNumericSignature('1/2 cup')).not.toBe(contentNumericSignature('1–2 cups'));
 expect(contentNumericSignature('10–15 minutes')).toBe(contentNumericSignature('10 bis 15 Minuten'));
 expect(contentNumericSignature('1.50')).toBe(contentNumericSignature('1,50'));
 expect(contentNumericSignature('1.50')).not.toBe(contentNumericSignature('1.5'));
});

test('temperature scale and negative freezing temperature stay explicit',()=>{
 expect(contentNumericSignature('Bake at 180°C')).not.toBe(contentNumericSignature('Bake at 180°F'));
 expect(contentNumericSignature('Freeze at -18°C')).not.toBe(contentNumericSignature('Freeze at 18°C'));
});
