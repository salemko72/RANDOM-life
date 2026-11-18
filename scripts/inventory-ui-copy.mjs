import ts from'typescript';
import{readFileSync,readdirSync,writeFileSync,existsSync}from'node:fs';
const root='apps/client/src/web/';
const source=new Set();const pairs=[];
const add=text=>{if(text.trim())source.add(text);};
function englishCondition(node){const text=node.getText();return text==='en'||/^locale\s*===\s*['"]en['"]$/.test(text);}
const literal=node=>ts.isStringLiteral(node)||ts.isNoSubstitutionTemplateLiteral(node);
for(const file of readdirSync(root).filter(name=>/\.tsx?$/.test(name))){
 const ast=ts.createSourceFile(file,readFileSync(root+file,'utf8'),ts.ScriptTarget.Latest,true,file.endsWith('tsx')?ts.ScriptKind.TSX:ts.ScriptKind.TS);
 function walk(node){
  if(ts.isVariableDeclaration(node)&&node.name.getText()==='english'&&node.initializer&&ts.isObjectLiteralExpression(node.initializer))for(const property of node.initializer.properties)if(ts.isPropertyAssignment(property)&&literal(property.initializer))add(property.initializer.text);
  if(ts.isCallExpression(node)&&node.expression.getText()==='formatUi'&&node.arguments.length&&literal(node.arguments[0]))add(node.arguments[0].text);
  if(ts.isConditionalExpression(node)&&englishCondition(node.condition)&&literal(node.whenTrue)&&literal(node.whenFalse)){add(node.whenTrue.text);pairs.push({en:node.whenTrue.text,bs:node.whenFalse.text,file});}
  if(ts.isCallExpression(node)&&['text','uiText'].includes(node.expression.getText())&&node.arguments.length>=2&&node.arguments.slice(0,2).every(literal)){add(node.arguments[0].text);pairs.push({en:node.arguments[0].text,bs:node.arguments[1].text,file});}
  ts.forEachChild(node,walk);
 }walk(ast);
}
for(const text of ['Automatic','Language','EAT','READ','WATCH','MOVE','GO','Spin in {category}','Full image: {title}','View full image: {title}','Backup · {count} items','Saved catalog · {count}','CATALOG ONLINE · {count} published items','Content is currently available in English.','another work; edition not specified','Language translations are being prepared.','Gluten','Sci-fi','Drama'])add(text);
const path=root+'i18n/source.json';
const existing=existsSync(path)?JSON.parse(readFileSync(path,'utf8')):{};
if(process.argv.includes('--check')){
 const missing=[...source].filter(key=>!Object.hasOwn(existing,key));
 if(missing.length){console.error('Missing UI source keys:',missing);process.exitCode=1;}
 else console.log(`PASS ${source.size} current UI keys covered by ${Object.keys(existing).length} stable source entries`);
}else if(process.argv.includes('--write')){
 // Retain historical keys so updating the inventory cannot silently drop translations.
 for(const key of Object.keys(existing))source.add(key);
 writeFileSync(path,JSON.stringify(Object.fromEntries([...source].sort().map(key=>[key,key])),null,2)+'\n');
}else console.log(JSON.stringify({count:source.size,keys:[...source].sort(),pairs},null,2));
