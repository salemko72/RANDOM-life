import{expect,test}from'vitest';
import React from'react';import{renderToStaticMarkup}from'react-dom/server';
import{uiText,formatUi,uiLocaleCode}from'../apps/client/src/web/ui-copy';
import{translate,categoryLabel}from'../apps/client/src/web/ui-language';
test('explicit English and BHS remain stable, unsupported locales fall back to English',()=>{
 expect(uiText('Ingredients','Sastojci','en')).toBe('Ingredients');expect(uiText('Ingredients','Sastojci','bs')).toBe('Sastojci');expect(uiText('Ingredients','Sastojci','xx')).toBe('Ingredients');
});
test('new UI languages resolve reviewed source keys without implicit BHS',()=>{
 for(const[locale,expected]of [['es','Ingredientes'],['pt-BR','Ingredientes'],['de','Zutaten'],['it','Ingredienti']]as const){
  expect(uiText('Ingredients','Sastojci',locale)).toBe(expected);
  expect(translate('Sastojci',locale)).toBe(expected);
  expect(categoryLabel('BOOK',locale)).not.toBe('KNJIGE');
 }
});
test('formatting replaces only named own parameters once and keeps React output escaped',()=>{
 const title='<img src=x onerror=alert(1)> {count}';
 const label=formatUi('Full image: {title}','de',{title});
 expect(label).toContain(title);expect(label).not.toContain('Full image:');
 expect(renderToStaticMarkup(React.createElement('span',null,label))).toContain('&lt;img');
 expect(formatUi('Backup · {count} items','es',{count:17})).toContain('17');
});

test('prototype names are unsupported locales and never dictionary registries',()=>{
 for(const locale of ['constructor','__proto__','toString'])expect(uiText('name','ime',locale)).toBe('name');
});

 test('automatic language badges identify each draft locale and streaming keeps platform names literal',()=>{
  for(const[locale,code]of [['en','ENG'],['bs','BHS'],['es','ESP'],['pt-BR','POR'],['de','DEU'],['it','ITA']]as const)expect(uiLocaleCode(locale)).toBe(code);
  for(const locale of ['es','pt-BR','de','it']){const label=formatUi('Streaming: {platform}',locale,{platform:'HBO <test>'});expect(label).toContain('HBO <test>');expect(label).not.toBe('Streaming: HBO <test>');}
 });
