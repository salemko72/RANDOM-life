import React from 'react';
import preview from './src/generated/preview.json';
// Expo Metro does not bundle relative CSS font/image URLs. Use the same
// self-contained document as Expo Go so every preview includes its assets.
export default function App(){
 return <iframe title="RANDOM — interaktivni preview" srcDoc={preview.html} style={{position:'fixed',inset:0,border:0,width:'100%',height:'100%',display:'block'}}/>;
}
