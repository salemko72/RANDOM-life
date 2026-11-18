import{expect,test}from'vitest';
import{readFileSync,readdirSync}from'node:fs';
import ts from'typescript';
import{translate}from'../apps/client/src/web/ui-language';
const root='apps/client/src/web/';const source=JSON.parse(readFileSync(root+'i18n/source.json','utf8'));
const literal=(node:ts.Node):node is ts.StringLiteral|ts.NoSubstitutionTemplateLiteral=>ts.isStringLiteral(node)||ts.isNoSubstitutionTemplateLiteral(node);
test('all static UI translation calls have a four-language source entry',()=>{
 const missing=new Set<string>();
 for(const file of readdirSync(root).filter(file=>/\.tsx?$/.test(file))){
  const ast=ts.createSourceFile(file,readFileSync(root+file,'utf8'),ts.ScriptTarget.Latest,true,file.endsWith('tsx')?ts.ScriptKind.TSX:ts.ScriptKind.TS);
  function visit(node:ts.Node){
   if(ts.isCallExpression(node)&&node.arguments.length&&literal(node.arguments[0])){
    const name=node.expression.getText(),key=node.arguments[0].text;
    if(['uiText','formatUi','text','t','translate'].includes(name)){
     const english=['t','translate'].includes(name)?translate(key,'en'):key;
     if(!Object.hasOwn(source,english))missing.add(file+': '+english);
    }
   }ts.forEachChild(node,visit);
  }visit(ast);
 }
 expect([...missing]).toEqual([]);
});

test('raw JSX keeps only brands and invariant units outside translation calls',()=>{
 const untranslated:string[]=[];const invariant=/^(?:(?:LifeSpinner|Spotify)(?:\s*[·↗])?|min(?:\s*·)?)$/;
 for(const file of readdirSync(root).filter(file=>file.endsWith('.tsx'))){
  const ast=ts.createSourceFile(file,readFileSync(root+file,'utf8'),ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
  function visit(node:ts.Node){
   if(ts.isJsxText(node)){const text=node.text.trim();if(/[a-zA-Z\u00c0-\u017f]/.test(text)&&!invariant.test(text))untranslated.push(file+': '+text);}
   if(ts.isJsxAttribute(node)&&['aria-label','title','placeholder','alt'].includes(node.name.getText())&&node.initializer&&ts.isStringLiteral(node.initializer)&&!invariant.test(node.initializer.text))untranslated.push(file+': '+node.initializer.text);
   ts.forEachChild(node,visit);
  }visit(ast);
 }
 expect(untranslated).toEqual([]);
});
